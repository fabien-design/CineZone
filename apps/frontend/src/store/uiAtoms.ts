import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { TrendingWindow } from '../api/movies';

export const trendingWindowAtom = atom<TrendingWindow>('week');

// Persisted to localStorage under key 'token' — same key used by axiosInstance
export const authTokenAtom = atomWithStorage<string | null>('token', null);
export const isAuthenticatedAtom = atom(get => get(authTokenAtom) !== null);
