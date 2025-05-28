import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function StarRating({ title = '', rating = 0, outOf = 5 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon key={`full-${i}`} className="h-10 w-10 text-orange-500" />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className="relative h-10 w-10">
        <StarOutlineIcon className="absolute h-10 w-10 text-orange-500" />
        <StarIcon
          className="absolute h-10 w-10 text-orange-500"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </span>,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarOutlineIcon
        key={`empty-${i}`}
        className="h-10 w-10 text-orange-500"
      />,
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-label-base text-core-black font">{title}</div>
      <div className="flex">{stars}</div>
    </div>
  );
}
