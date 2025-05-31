import { Badge } from '../atom/badge';
import { formatOwnershipPercentage } from '../../../lib/stringFormatters';
/*Todo: 
-Extract badgeColorVariant to helper file
-The long keys inside badge will need a design decision and likey need to be converted for display
-Review max-w set on button after that decision is made
-When access to real query data is granted will need to make small changes from test data setup
*/

const badgeColorVariantsOwnership = {
  '5% OR GREATER DIRECT OWNERSHIP INTEREST': 'cyan',
  '5% OR GREATER INDIRECT OWNERSHIP INTEREST': 'indigo',
  'OPERATIONAL/MANAGERIAL CONTROL': 'fuchsia',
  'CORPORATE OFFICER': 'pink',
  'MANAGING EMPLOYEE': 'rose',
};
export function OwnershipAndStakeholders({ item }) {
  const badgeColor = badgeColorVariantsOwnership[item.CMS_Ownership_Role];

  return (
    <>
      {/*These divs could be components, but concerned the amount of them required would create a mess */}
      <div className="flex flex-col gap-2">
        <div className="text-label-xs">
          {item.CMS_Ownership_Type.toUpperCase()}
        </div>
        <div className="text-paragraph-base col-span-1">
          {item.CMS_Ownership_Name}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-label-xs">OWNERSHIP PERCENTAGE</div>
        <div className="text-paragraph-base col-span-1">
          {formatOwnershipPercentage(item.CMS_Ownership_Percentage)}
        </div>
      </div>

      <Badge
        className={'col-span-1 flex max-w-44 justify-center'}
        color={badgeColor}
      >
        {item.CMS_Ownership_Role}
      </Badge>
    </>
  );
}
