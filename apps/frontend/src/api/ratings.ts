import api from './axiosInstance';
import type { RatingValues } from '@/lib/schemas/rating';

export type Rating = {
  id: number;
  user_id: number;
  tmdb_id: number;
  score: number;
  comment: string | null;
};

export const ratingsApi = {
  getForMovie: (tmdbId: number) =>
    api.get<Rating[]>(`/ratings/movie/${tmdbId}`).then(r => r.data),

  getMyRating: (tmdbId: number) =>
    api.get<Rating>(`/ratings/movie/${tmdbId}/me`).then(r => r.data),

  upsert: (tmdbId: number, values: RatingValues) =>
    api.put<Rating>(`/ratings/movie/${tmdbId}`, {
      score: values.rating,
      comment: values.comment ?? null,
    }).then(r => r.data),

  delete: (tmdbId: number) =>
    api.delete(`/ratings/movie/${tmdbId}`).then(r => r.data),
};
