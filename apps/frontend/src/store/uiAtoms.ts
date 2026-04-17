import { atom } from 'jotai';
import type { TrendingWindow } from '../api/movies';

export const trendingWindowAtom = atom<TrendingWindow>('week');
