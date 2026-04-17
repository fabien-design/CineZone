import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserListPage } from '../components/user/UserListPage';
import { useFavorites } from '../hooks/useUserLists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function FavoritesPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('lists.favorites'));
    const { data, isLoading } = useFavorites();
    return (
        <UserListPage
            title={t('lists.favorites')}
            icon={<Bookmark size={24} />}
            movies={data}
            isLoading={isLoading}
            emptyMessage={t('lists.emptyFavorites')}
        />
    );
}
