import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '@/components/auth/LoginForm';

const { loginMock } = vi.hoisted(() => ({ loginMock: vi.fn() }));

vi.mock('@/api/auth', () => ({
  authApi: { login: loginMock },
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'login.email': 'Email',
        'login.emailPlaceholder': 'john.doe@example.com',
        'login.password': 'Password',
        'login.passwordPlaceholder': '********',
        'login.hidePassword': 'Hide password',
        'login.showPassword': 'Show password',
        'login.error': 'Email or password is incorrect.',
        'login.submit': 'Log In',
        'login.success': 'Welcome back!',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    loginMock.mockClear();
  });

  it('renders email, password fields and submit button', () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('shows inline error on failed login', async () => {
    loginMock.mockRejectedValue(new Error('Unauthorized'));
    render(<LoginForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad@mail.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() =>
      expect(screen.getByText('Email or password is incorrect.')).toBeInTheDocument()
    );
  });

  it('calls onSuccess callback after successful login', async () => {
    loginMock.mockResolvedValue({});
    const onSuccess = vi.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@mail.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('toggles password visibility', () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
