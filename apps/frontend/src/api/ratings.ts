import api from './axiosInstance';
import type { RatingValues } from '@/lib/schemas/rating';
import type { MovieRef } from '@/types/movie';

export type Rating = {
  id: number;
  user_id: number;
  movie_id: number;
  score: number;
  comment: string | null;
  username: string;
  created_at: string;
};

function ratingPath(ref: MovieRef) {
  return `/ratings/${ref.source}/${ref.id}`;
}

export const ratingsApi = {
  getForMovie: (ref: MovieRef) =>
    api.get<Rating[]>(ratingPath(ref)).then(r => r.data),

  getMyRating: (ref: MovieRef): Promise<Rating | null> =>
    api.get<Rating>(`${ratingPath(ref)}/me`).then(r => r.data).catch(err => {
      if (err.response?.status === 404) return null;
      throw err;
    }),

  upsert: (ref: MovieRef, values: RatingValues) =>
    api.put<Rating>(ratingPath(ref), {
      score: values.rating,
      comment: values.comment ?? null,
    }).then(r => r.data),

  delete: (ref: MovieRef) =>
    api.delete(ratingPath(ref)).then(r => r.data),
};
