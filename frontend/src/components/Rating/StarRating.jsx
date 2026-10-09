import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, reviewCount, showCount = true, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5 text-xs text-toyText-secondary">
      <div className="flex items-center text-toyGold">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          return (
            <Star
              key={i}
              size={size}
              className={`${
                isFilled ? 'fill-toyGold text-toyGold' : 'fill-gray-200 text-gray-200'
              }`}
            />
          );
        })}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-gray-500 font-medium">({reviewCount})</span>
      )}
    </div>
  );
};
