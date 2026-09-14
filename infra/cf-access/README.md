# CloudFront access gate

Viewer-request Lambda@Edge that replaced the shared `hefti` / `hefti2026` basic-auth prompt.

- Public: `/`, `/index.html`, `/assets/*`, and other static files
- Everything else requires a `hefti_access` HMAC cookie issued by `POST /api/auth/verify`
- Missing cookie → `302 /?next=<original path>` so the landing-page modal can open

Lambda@Edge has no environment variables. `publish.sh` inlines `AUTH_SESSION_SECRET` at zip time. Use the **same secret** as the `hefti-data-api` Lambda.

```bash
AUTH_SESSION_SECRET='...' AWS_PROFILE=hefti ./hefti/infra/cf-access/publish.sh
```

Function name stays `hefti-cf-basic-auth` (us-east-1) on distribution `EHV0XK8BGXTWE`.

The S3 origin is the REST endpoint `hefti-app.s3.us-east-2.amazonaws.com` via Origin Access Identity `E1561HLUR4GUT9`. The bucket is not public; the old website endpoint is disabled.
