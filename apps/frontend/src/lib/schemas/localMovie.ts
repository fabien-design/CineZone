import { z } from 'zod';

const optionalUrl = z
    .string()
    .optional()
    .transform(v => (v === '' ? null : v))
    .pipe(z.string().url('URL invalide').nullable().optional());

export const localMovieSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    overview: z.string().optional(),
    poster_url: optionalUrl,
    backdrop_url: optionalUrl,
    release_date: z.string().optional(),
    vote_average: z.coerce
        .number()
        .min(0, 'Min 0')
        .max(10, 'Max 10')
        .optional()
        .or(z.literal('')),
    genre_ids: z.array(z.number()).optional(),
});

export type LocalMovieValues = z.infer<typeof localMovieSchema>;
