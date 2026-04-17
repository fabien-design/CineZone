import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserListPage } from '../components/user/UserListPage';
import { useWatched } from '../hooks/useUserLists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function HistoryPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('lists.watched'));
    const { data, isLoading } = useWatched();
    return (
        <UserListPage
            title={t('lists.watched')}
            icon={<Eye size={24} />}
            movies={data}
            isLoading={isLoading}
            emptyMessage={t('lists.emptyWatched')}
        />
    );
}
