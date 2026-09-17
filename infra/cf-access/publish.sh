#!/usr/bin/env bash
# Publish the CloudFront viewer-request Lambda@Edge function.
# Usage: AUTH_SESSION_SECRET=... ./publish.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
: "${AUTH_SESSION_SECRET:?Set AUTH_SESSION_SECRET to the same value as the API Lambda}"
PROFILE="${AWS_PROFILE:-hefti}"
REGION="us-east-1"
FUNCTION_NAME="hefti-cf-basic-auth"
DISTRIBUTION_ID="EHV0XK8BGXTWE"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

python3 - "$ROOT/index.js" "$TMP/index.js" <<'PY'
import os, sys
from pathlib import Path
src, dest = sys.argv[1], sys.argv[2]
secret = os.environ["AUTH_SESSION_SECRET"]
text = Path(src).read_text()
if "__AUTH_SESSION_SECRET__" not in text:
    raise SystemExit("placeholder missing in index.js")
Path(dest).write_text(text.replace("__AUTH_SESSION_SECRET__", secret))
PY

(
  cd "$TMP"
  zip -q function.zip index.js
)

aws lambda update-function-code \
  --profile "$PROFILE" \
  --region "$REGION" \
  --function-name "$FUNCTION_NAME" \
  --zip-file "fileb://$TMP/function.zip"

aws lambda wait function-updated \
  --profile "$PROFILE" \
  --region "$REGION" \
  --function-name "$FUNCTION_NAME"

VERSION="$(
  aws lambda publish-version \
    --profile "$PROFILE" \
    --region "$REGION" \
    --function-name "$FUNCTION_NAME" \
    --query Version \
    --output text
)"

ARN="arn:aws:lambda:${REGION}:330552994757:function:${FUNCTION_NAME}:${VERSION}"
echo "Published $ARN"

aws lambda add-permission \
  --profile "$PROFILE" \
  --region "$REGION" \
  --function-name "${FUNCTION_NAME}:${VERSION}" \
  --statement-id "AllowCloudFrontGetFunction-${VERSION}" \
  --action lambda:GetFunction \
  --principal edgelambda.amazonaws.com \
  --source-arn "arn:aws:cloudfront::330552994757:distribution/${DISTRIBUTION_ID}" \
  >/dev/null 2>&1 || true

aws cloudfront get-distribution-config \
  --profile "$PROFILE" \
  --id "$DISTRIBUTION_ID" \
  --output json > "$TMP/cf.json"

python3 - "$TMP/cf.json" "$ARN" "$TMP/cf-put.json" <<'PY'
import json, sys
src, arn, dest = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open(src))
etag = data["ETag"]
cfg = data["DistributionConfig"]
cfg["DefaultCacheBehavior"]["LambdaFunctionAssociations"] = {
    "Quantity": 1,
    "Items": [
        {
            "LambdaFunctionARN": arn,
            "EventType": "viewer-request",
            "IncludeBody": False,
        }
    ],
}
json.dump({"ETag": etag, "DistributionConfig": cfg}, open(dest, "w"))
print(etag)
PY

ETAG="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["ETag"])' "$TMP/cf-put.json")"
python3 -c 'import json,sys; json.dump(json.load(open(sys.argv[1]))["DistributionConfig"], open(sys.argv[2],"w"))' \
  "$TMP/cf-put.json" "$TMP/cf-config.json"

aws cloudfront update-distribution \
  --profile "$PROFILE" \
  --id "$DISTRIBUTION_ID" \
  --if-match "$ETAG" \
  --distribution-config "file://$TMP/cf-config.json" \
  --query 'Distribution.Status' \
  --output text

echo "CloudFront update submitted. Propagation can take several minutes."
echo "The shared basic-auth prompt is replaced once this deploy completes."
