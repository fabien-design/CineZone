const BASE = import.meta.env.VITE_TMDB_IMAGE_BASE ?? 'https://image.tmdb.org/t/p';

export const getPosterUrl = (path: string | null, size = 'w500'): string => {
  if (!path) return '/placeholder-poster.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size = 'original'): string | null =>
  path ? `${BASE}/${size}${path}` : null;

export const formatRating = (rating: number | string | null | undefined): string => {
  const n = Number(rating);
  if (!n) return 'N/A';
  return n.toFixed(1);
};

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
