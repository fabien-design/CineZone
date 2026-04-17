export type SourceFilter = 'all' | 'tmdb' | 'local';

export type RatingKey = 'bad' | 'meh' | 'good' | 'great';

export interface RatingConfig {
    key: RatingKey;
    label: string;
    gte: number;
    lte: number;
}
