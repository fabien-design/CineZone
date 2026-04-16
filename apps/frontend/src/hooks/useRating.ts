import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '@/api/ratings';
import type { RatingValues } from '@/lib/schemas/rating';
import type { MovieRef } from '@/types/movie';

export function useRating(ref: MovieRef, isAuthenticated: boolean) {
  const queryClient = useQueryClient();

  const movieRatingsKey = ['ratings', ref.source, ref.id];
  const myRatingKey = ['ratings', 'me', ref.source, ref.id];

  const { data: movieRatings = [], isLoading: isLoadingRatings } = useQuery({
    queryKey: movieRatingsKey,
    queryFn: () => ratingsApi.getForMovie(ref),
  });

  const { data: myRating = null } = useQuery({
    queryKey: myRatingKey,
    queryFn: () => ratingsApi.getMyRating(ref),
    enabled: isAuthenticated,
    retry: false,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: movieRatingsKey });
    queryClient.invalidateQueries({ queryKey: myRatingKey });
  };

  const upsert = useMutation({
    mutationFn: (values: RatingValues) => ratingsApi.upsert(ref, values),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => ratingsApi.delete(ref),
    onSuccess: invalidate,
  });

  return {
    movieRatings,
    myRating,
    isLoadingRatings,
    upsert: upsert.mutateAsync,
    isUpserting: upsert.isPending,
    remove: remove.mutateAsync,
    isRemoving: remove.isPending,
  };
}
