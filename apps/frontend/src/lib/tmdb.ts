const BASE = import.meta.env.VITE_TMDB_IMAGE_BASE ?? 'https://image.tmdb.org/t/p';

export const getPosterUrl = (path: string | null, size = 'w500'): string =>
  path ? `${BASE}/${size}${path}` : '/placeholder-poster.svg';

export const getBackdropUrl = (path: string | null, size = 'original'): string | null =>
  path ? `${BASE}/${size}${path}` : null;

export const formatRating = (rating: number): string =>
  rating.toFixed(1);

export const formatYear = (date: string | undefined): string =>
  date?.split('-')[0] ?? '';

export const getProfileUrl = (path: string | null, size = 'w185'): string =>
  path ? `${BASE}/${size}${path}` : '/placeholder-avatar.svg';

export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatMoney = (amount: number): string => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(amount);
};
