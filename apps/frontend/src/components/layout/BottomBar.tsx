import { Link, useLocation } from 'react-router';
import { Home, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { RandomMovieButton } from '../ui/RandomMovieButton';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export default function BottomBar() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/discover', label: t('nav.discover'), icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-cinema-950/80 backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-4 py-2 text-sm transition-colors',
              location.pathname === path
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
        <RandomMovieButton className="px-4 py-2" variant="bottombar" />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
