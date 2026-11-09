import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, max = 5, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= Math.round(rating);

        return (
          <button
            key={starNumber}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: interactive ? 'pointer' : 'default',
              display: 'flex',
              color: isFilled ? 'var(--color-gold)' : '#D1CABE'
            }}
            aria-label={`${starNumber} Stars`}
          >
            <Star
              size={size}
              fill={isFilled ? 'var(--color-gold)' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
