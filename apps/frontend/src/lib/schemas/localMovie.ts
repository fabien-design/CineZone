import { z } from 'zod';

const optionalUrl = z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url('URL invalide').optional().nullable(),
);

export const localMovieSchema = z.object({
    title: z
        .string({ required_error: 'Le titre est requis' })
        .min(2, 'Le titre doit contenir au moins 2 caractères'),
    overview: z.string().min(1, 'Le synopsis est requis'),
    poster_url: optionalUrl,
    poster_file: z.any().optional(),
    backdrop_url: optionalUrl,
    backdrop_file: z.any().optional(),
    release_date: z.string().optional(),
    vote_average: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z.number({ invalid_type_error: 'Doit être un nombre' }).min(0, 'Min 0').max(10, 'Max 10').optional(),
    ),
    genre_ids: z.array(z.number()).optional(),
});

export type LocalMovieValues = z.infer<typeof localMovieSchema>;
