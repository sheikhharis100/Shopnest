const Rating = ({ value, numReviews, size = 'sm' }) => {
  const stars = [1, 2, 3, 4, 5];
  const textSize = size === 'lg' ? 'text-xl' : 'text-sm';

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center gap-0.5 ${textSize}`}>
        {stars.map((star) => (
          <span key={star} className={value >= star ? 'text-yellow-400' : value >= star - 0.5 ? 'text-yellow-300' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="text-brand-blue text-xs hover:underline cursor-pointer">
          ({numReviews.toLocaleString()} {numReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;
