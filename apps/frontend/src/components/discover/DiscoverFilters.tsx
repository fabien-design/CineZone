import { X } from 'lucide-react';
import { FilterChip } from './FilterChip';
import { FilterRow } from './FilterRow';
import { RATING_FILTERS } from '../../lib/discover';
import type { Genre } from '../../types/movie';
import type { RatingKey, SourceFilter } from '../../types/discover';

interface DiscoverFiltersProps {
    source: SourceFilter;
    onSourceChange: (source: SourceFilter) => void;
    rating: RatingKey | null;
    onRatingChange: (rating: RatingKey | null) => void;
    selectedGenres: number[];
    onGenreToggle: (id: number) => void;
    onGenresClear: () => void;
    onClearAll: () => void;
    genres: Genre[];
    hasActiveFilters: boolean;
}

const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
    { value: 'all',   label: 'Tous'  },
    { value: 'tmdb',  label: 'TMDB'  },
    { value: 'local', label: 'Local' },
];

export function DiscoverFilters({
    source,
    onSourceChange,
    rating,
    onRatingChange,
    selectedGenres,
    onGenreToggle,
    onGenresClear,
    onClearAll,
    genres,
    hasActiveFilters,
}: DiscoverFiltersProps) {
    const sourceOptions = SOURCE_OPTIONS;

    return (
        <div className="flex flex-col gap-3 bg-cinema-900/40 border border-border/30 rounded-xl p-4">
            <FilterRow label="Source">
                {sourceOptions.map(({ value, label }) => (
                    <FilterChip
                        key={value}
                        active={source === value}
                        onClick={() => onSourceChange(value)}
                    >
                        {label}
                    </FilterChip>
                ))}
            </FilterRow>

            <FilterRow label="Note">
                <FilterChip active={rating === null} onClick={() => onRatingChange(null)}>
                    Toutes
                </FilterChip>
                {RATING_FILTERS.map(r => (
                    <FilterChip
                        key={r.key}
                        active={rating === r.key}
                        onClick={() => onRatingChange(rating === r.key ? null : r.key)}
                        ratingKey={r.key}
                    >
                        {r.label}
                        <span className="ml-1 opacity-50">{r.gte}–{r.lte}</span>
                    </FilterChip>
                ))}
            </FilterRow>

            {genres.length > 0 && (
                <FilterRow label="Genre">
                    <FilterChip
                        active={selectedGenres.length === 0}
                        onClick={onGenresClear}
                    >
                        Tous
                    </FilterChip>
                    {genres.map(genre => (
                        <FilterChip
                            key={genre.id}
                            active={selectedGenres.includes(genre.id)}
                            onClick={() => onGenreToggle(genre.id)}
                        >
                            {genre.name}
                        </FilterChip>
                    ))}
                </FilterRow>
            )}

            {hasActiveFilters && (
                <div className="flex justify-end border-t border-border/20 pt-2 mt-1">
                    <button
                        onClick={onClearAll}
                        className="text-xs text-cinema-500 hover:text-reel-400 flex items-center gap-1 transition-colors"
                    >
                        <X size={11} />
                        Réinitialiser
                    </button>
                </div>
            )}
        </div>
    );
}
