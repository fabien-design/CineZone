import { Bookmark } from 'lucide-react';
import { UserListPage } from '../components/user/UserListPage';
import { useFavorites } from '../hooks/useUserLists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function FavoritesPage() {
    useDocumentTitle('Favorites');
    const { data, isLoading } = useFavorites();
    return (
        <UserListPage
            title="Favorites"
            icon={<Bookmark size={24} />}
            movies={data}
            isLoading={isLoading}
            emptyMessage="No favorites yet — bookmark a movie to save it here."
        />
    );
}
