import type { LocalMovie, Movie } from '../types/movie';
import type { RatingConfig, RatingKey } from '../types/discover';

export const RATING_FILTERS: readonly RatingConfig[] = [
    { key: 'bad',   label: 'BAD',   gte: 0, lte: 4  },
    { key: 'meh',   label: 'MEH',   gte: 4, lte: 6  },
    { key: 'good',  label: 'GOOD',  gte: 6, lte: 8  },
    { key: 'great', label: 'GREAT', gte: 8, lte: 10 },
] as const;

export const RATING_CHIP_STYLES: Record<RatingKey, { active: string; idle: string }> = {
    bad:   { active: 'bg-red-400/20   border-red-400/50   text-red-300',   idle: 'border-border/40 text-cinema-400 hover:border-red-400/40   hover:text-red-400'   },
    meh:   { active: 'bg-amber-400/20 border-amber-400/50 text-amber-300', idle: 'border-border/40 text-cinema-400 hover:border-amber-400/40 hover:text-amber-400' },
    good:  { active: 'bg-green-400/20 border-green-400/50 text-green-300', idle: 'border-border/40 text-cinema-400 hover:border-green-400/40 hover:text-green-400' },
    great: { active: 'bg-reel-400/20  border-reel-400/50  text-reel-300',  idle: 'border-border/40 text-cinema-400 hover:border-reel-400/40  hover:text-reel-400'  },
};

export function localToMovie(m: LocalMovie): Movie {
    return {
        id: m.id,
        source: 'local',
        title: m.title,
        overview: m.overview ?? '',
        poster_path: m.poster_url,
        backdrop_path: m.backdrop_url,
        release_date: m.release_date ?? '',
        vote_average: m.vote_average ?? 0,
        vote_count: 0,
        popularity: 0,
        genre_ids: m.genres.map(g => g.id),
    };
}
