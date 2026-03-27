import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  readonly?: boolean;
}

export function StarRating({ value, onChange, max = 10, readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div
      className="flex gap-0.5"
      role="group"
      aria-label={`Movie rating, ${value} out of ${max}`}
      onMouseLeave={() => !readonly && setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            aria-label={`Rate ${star} out of ${max}`}
            aria-pressed={value === star}
            onMouseEnter={() => !readonly && setHovered(star)}
            onClick={() => !readonly && onChange(star)}
            className="text-xl leading-none transition-colors duration-75 disabled:cursor-default"
          >
            <span className={filled ? 'text-reel-400' : 'text-cinema-600'}>★</span>
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-reel-400 font-semibold self-center">
          {value}/10
        </span>
      )}
    </div>
  );
}
