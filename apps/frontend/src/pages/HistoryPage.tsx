import { Eye } from 'lucide-react';
import { UserListPage } from '../components/user/UserListPage';
import { useWatched } from '../hooks/useUserLists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function HistoryPage() {
    useDocumentTitle('History');
    const { data, isLoading } = useWatched();
    return (
        <UserListPage
            title="Watched"
            icon={<Eye size={24} />}
            movies={data}
            isLoading={isLoading}
            emptyMessage="No movies marked as watched yet."
        />
    );
}
