import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Film } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { cn } from '@/lib/utils';

export type Tab = 'login' | 'register';

type Props = { choosedTab?: Tab };

export function AuthPage({ choosedTab }: Props) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(choosedTab ?? 'login');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Film className="text-primary" size={32} />
          <span className="text-2xl font-bold tracking-tight">
            Cine<span className="text-primary">Zone</span>
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            {(['login', 'register'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 rounded-md py-2 text-sm font-medium transition-all cursor-pointer',
                  tab === t
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/10',
                )}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-semibold mb-6">
            {tab === 'login' ? 'Welcome Back!' : 'Join CineZone'}
          </h1>

          {tab === 'login' ? (
            <LoginForm onSuccess={() => navigate('/')} />
          ) : (
            <RegisterForm onSuccess={() => setTab('login')} />
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {tab === 'login' ? (
              <>
                Don't have an account yet?{' '}
                <button
                  onClick={() => setTab('register')}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setTab('login')}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
