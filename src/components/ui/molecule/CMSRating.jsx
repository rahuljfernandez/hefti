import StarRating from './starRating';

export default function CMSRating({ stars = [] }) {
  return (
    <div>
      <div className="py-6">
        <div className="text-heading-xs">CMS Ratings</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {stars.map((stars, i) => (
          <div key={stars.title + i}>
            <StarRating title={stars.title} rating={stars.rating} />
          </div>
        ))}
      </div>
    </div>
  );
}
