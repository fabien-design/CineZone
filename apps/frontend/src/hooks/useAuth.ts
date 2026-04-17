import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { navigate } from '@/lib/navigation';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const logout = async () => {
    await authApi.logout();
    queryClient.removeQueries({ queryKey: ['auth'] });
    navigate('/login');
  };

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };
}
