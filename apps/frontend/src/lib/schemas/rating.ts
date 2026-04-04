import { z } from 'zod';

export const ratingSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(10, 'Rating must be at most 10'),
  comment: z.string().max(500, 'Comment must be at most 500 characters').nullable(),
});

export type RatingValues = z.infer<typeof ratingSchema>;
