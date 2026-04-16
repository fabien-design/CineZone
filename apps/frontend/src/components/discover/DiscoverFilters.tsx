import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
        { value: 'all',   label: t('discover.sourceAll') },
        { value: 'tmdb',  label: 'TMDB'  },
        { value: 'local', label: 'Local' },
    ];

    return (
        <div className="flex flex-col gap-3 bg-cinema-900/40 border border-border/30 rounded-xl p-4">
            <FilterRow label={t('discover.source')}>
                {SOURCE_OPTIONS.map(({ value, label }) => (
                    <FilterChip
                        key={value}
                        active={source === value}
                        onClick={() => onSourceChange(value)}
                    >
                        {label}
                    </FilterChip>
                ))}
            </FilterRow>

            <FilterRow label={t('discover.note')}>
                <FilterChip active={rating === null} onClick={() => onRatingChange(null)}>
                    {t('discover.noteAll')}
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
                <FilterRow label={t('discover.genre')}>
                    <FilterChip
                        active={selectedGenres.length === 0}
                        onClick={onGenresClear}
                    >
                        {t('discover.genreAll')}
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
                        {t('discover.reset')}
                    </button>
                </div>
            )}
        </div>
    );
}
