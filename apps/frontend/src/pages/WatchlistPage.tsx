import { ClockPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserListPage } from '../components/user/UserListPage';
import { useWatchlist } from '../hooks/useUserLists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function WatchlistPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('lists.watchlist'));
    const { data, isLoading } = useWatchlist();
    return (
        <UserListPage
            title={t('lists.watchlist')}
            icon={<ClockPlus size={24} />}
            movies={data}
            isLoading={isLoading}
            emptyMessage={t('lists.emptyWatchlist')}
        />
    );
}
