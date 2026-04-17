import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RandomMovieButton } from '@/components/ui/RandomMovieButton';

const { navigateMock, getRandom } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  getRandom: vi.fn(),
}));

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'random.label': 'Random',
        'random.ariaLabel': 'Go to a random movie',
        'random.error': 'Could not find a random movie. Try again!',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/api/movies', () => ({
  moviesApi: { getRandom },
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

describe('RandomMovieButton — navbar variant', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    getRandom.mockClear();
  });

  it('renders with label and aria-label', () => {
    render(<RandomMovieButton variant="navbar" />);
    const btn = screen.getByRole('button', { name: 'Go to a random movie' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Random');
  });

  it('navigates to movie page on success', async () => {
    getRandom.mockResolvedValue({ id: 123, title: 'Inception' });
    render(<RandomMovieButton variant="navbar" />);
    fireEvent.click(screen.getByRole('button', { name: 'Go to a random movie' }));
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/movies/123'));
  });

  it('is disabled while loading', async () => {
    getRandom.mockReturnValue(new Promise(() => {})); // never resolves
    render(<RandomMovieButton variant="navbar" />);
    const btn = screen.getByRole('button', { name: 'Go to a random movie' });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });
});

describe('RandomMovieButton — bottombar variant', () => {
  it('renders bottombar variant with Random label', () => {
    render(<RandomMovieButton variant="bottombar" />);
    expect(screen.getByText('Random')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to a random movie' })).toBeInTheDocument();
  });
});
