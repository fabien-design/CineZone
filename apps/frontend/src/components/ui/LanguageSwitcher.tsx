import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const setLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="flex items-center gap-0.5 text-xs font-medium">
      <button
        onClick={() => setLang('fr')}
        aria-label="Français"
        className={cn(
          'px-1.5 py-0.5 rounded transition-colors cursor-pointer',
          i18n.language === 'fr'
            ? 'text-reel-400'
            : 'text-cinema-400 hover:text-screen-200',
        )}
      >
        FR
      </button>
      <span className="text-cinema-600 select-none">|</span>
      <button
        onClick={() => setLang('en')}
        aria-label="English"
        className={cn(
          'px-1.5 py-0.5 rounded transition-colors cursor-pointer',
          i18n.language === 'en'
            ? 'text-reel-400'
            : 'text-cinema-400 hover:text-screen-200',
        )}
      >
        EN
      </button>
    </div>
  );
}
