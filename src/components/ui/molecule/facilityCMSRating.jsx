import StarRating from './starRating';

export default function FacilityCMSRating() {
  return (
    <div>
      <div className="py-6">
        <div className="text-heading-xs">CMS Ratings</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div>
          <StarRating title="Overall Star Rating" rating={3.5} />
        </div>
        <div>
          <StarRating title="Average Collective Owner Ranking" rating={4} />
        </div>
      </div>
    </div>
  );
}
