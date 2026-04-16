import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useNavigate, useSearchParams } from 'react-router';
import { Film } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { cn } from '@/lib/utils';

export type Tab = 'login' | 'register';

type Props = { choosedTab?: Tab };

export function AuthPage({ choosedTab }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  const [tab, setTab] = useState<Tab>(choosedTab ?? 'login');
  useDocumentTitle(tab === 'login' ? t('auth.loginTab') : t('auth.registerTab'));

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
            {(['login', 'register'] as Tab[]).map(tabKey => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={cn(
                  'flex-1 rounded-md py-2 text-sm font-medium transition-all cursor-pointer',
                  tab === tabKey
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/10',
                )}
              >
                {tabKey === 'login' ? t('auth.loginTab') : t('auth.registerTab')}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-semibold mb-6">
            {tab === 'login' ? t('auth.welcomeBack') : t('auth.joinCinezone')}
          </h1>

          {tab === 'login' ? (
            <LoginForm onSuccess={() => navigate(redirectTo)} />
          ) : (
            <RegisterForm onSuccess={() => setTab('login')} />
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {tab === 'login' ? (
              <>
                {t('auth.noAccount')}{' '}
                <button
                  onClick={() => setTab('register')}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {t('auth.signUpLink')}
                </button>
              </>
            ) : (
              <>
                {t('auth.alreadyAccount')}{' '}
                <button
                  onClick={() => setTab('login')}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {t('auth.logInLink')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
