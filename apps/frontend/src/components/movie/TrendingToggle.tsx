import { cn } from '../../lib/utils';
import type { TrendingWindow } from '../../api/movies';
import { useTranslation } from 'react-i18next';

interface TrendingToggleProps {
  value: TrendingWindow;
  onChange: (window: TrendingWindow) => void;
}

const OPTIONS: { value: TrendingWindow; label: string }[] = [
  { value: 'day', label: 'trendingToday' },
  { value: 'week', label: 'trendingThisWeek' },
];

export function TrendingToggle({ value, onChange }: TrendingToggleProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex gap-1 bg-cinema-800 rounded-lg p-1"
      role="group"
      aria-label="Trending time window"
    >
      {OPTIONS.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
            value === option.value
              ? 'bg-reel-500 text-cinema-950'
              : 'text-cinema-300 hover:text-screen-100',
          )}
        >
          {t(`home.${option.label}`)}
        </button>
      ))}
    </div>
  );
}
