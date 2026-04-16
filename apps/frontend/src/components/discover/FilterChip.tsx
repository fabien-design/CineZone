import { cn } from '../../lib/utils';
import { RATING_CHIP_STYLES } from '../../lib/discover';
import type { RatingKey } from '../../types/discover';

interface FilterChipProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ratingKey?: RatingKey;
}

export function FilterChip({ active, onClick, children, ratingKey }: FilterChipProps) {
    const colorClass = ratingKey
        ? active
            ? RATING_CHIP_STYLES[ratingKey].active
            : RATING_CHIP_STYLES[ratingKey].idle
        : active
        ? 'bg-reel-400/20 border-reel-400/50 text-reel-400'
        : 'border-border/40 text-cinema-400 hover:border-reel-400/30 hover:text-screen-100';

    return (
        <button
            onClick={onClick}
            className={cn(
                'px-3 py-1 rounded-full border text-xs font-medium transition-all duration-150 whitespace-nowrap',
                colorClass,
            )}
        >
            {children}
        </button>
    );
}
