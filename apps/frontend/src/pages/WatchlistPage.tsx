import { ClockPlus } from 'lucide-react';
import { UserListPage } from '../components/user/UserListPage';
import { useWatchlist } from '../hooks/useUserLists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function WatchlistPage() {
    useDocumentTitle('Watchlist');
    const { data, isLoading } = useWatchlist();
    return (
        <UserListPage
            title="Watchlist"
            icon={<ClockPlus size={24} />}
            movies={data}
            isLoading={isLoading}
            emptyMessage="Your watchlist is empty — add movies you want to watch."
        />
    );
}
