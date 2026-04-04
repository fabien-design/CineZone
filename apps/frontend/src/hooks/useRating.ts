import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '@/api/ratings';
import type { RatingValues } from '@/lib/schemas/rating';

export function useRating(tmdbId: number, isAuthenticated: boolean) {
  const queryClient = useQueryClient();
  const queryKey = ['ratings', 'me', tmdbId];

  const { data: myRating, isLoading } = useQuery({
    queryKey,
    queryFn: () => ratingsApi.getMyRating(tmdbId),
    enabled: isAuthenticated,
    retry: false,
  });

  const upsert = useMutation({
    mutationFn: (values: RatingValues) => ratingsApi.upsert(tmdbId, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: () => ratingsApi.delete(tmdbId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    myRating: myRating ?? null,
    isLoading,
    upsert: upsert.mutateAsync,
    remove: remove.mutateAsync,
  };
}
