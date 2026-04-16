import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

// Mock react-i18next
const changeLanguageMock = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: changeLanguageMock,
    },
    t: (key: string) => key,
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    changeLanguageMock.mockClear();
    localStorage.clear();
  });

  it('renders FR and EN buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'Français' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('calls changeLanguage with "fr" when FR is clicked', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: 'Français' }));
    expect(changeLanguageMock).toHaveBeenCalledWith('fr');
  });

  it('calls changeLanguage with "en" when EN is clicked', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(changeLanguageMock).toHaveBeenCalledWith('en');
  });

  it('persists language preference in localStorage', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: 'Français' }));
    expect(localStorage.getItem('lang')).toBe('fr');
  });
});
