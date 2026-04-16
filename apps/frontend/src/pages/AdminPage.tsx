import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Navigate } from 'react-router';
import { Plus, Pencil, Trash2, Loader2, Film } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
    useLocalMovies,
    useCreateLocalMovie,
    useUpdateLocalMovie,
    useDeleteLocalMovie,
} from '@/hooks/useMovies';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { GenreBadge } from '@/components/ui/GenreBadge';
import { MovieFormDialog } from '@/components/admin/MovieFormDialog';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LocalMovie } from '@/types/movie';
import type { LocalMovieValues } from '@/lib/schemas/localMovie';
import BottomBar from '@/components/layout/BottomBar';

export function AdminPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('admin.title'));
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data: movies = [], isLoading: isMoviesLoading } = useLocalMovies();

    const createMovie = useCreateLocalMovie();
    const updateMovie = useUpdateLocalMovie();
    const deleteMovie = useDeleteLocalMovie();

    const [formOpen, setFormOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<LocalMovie | undefined>(undefined);
    const [deletingMovie, setDeletingMovie] = useState<LocalMovie | undefined>(undefined);

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-cinema-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-reel-400" size={32} />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const openCreate = () => {
        setEditingMovie(undefined);
        setFormOpen(true);
    };

    const openEdit = (movie: LocalMovie) => {
        setEditingMovie(movie);
        setFormOpen(true);
    };

    const handleFormSubmit = async (values: LocalMovieValues) => {
        const payload = {
            title: values.title,
            overview: values.overview || null,
            poster_url: values.poster_url ?? null,
            backdrop_url: values.backdrop_url ?? null,
            release_date: values.release_date || null,
            vote_average:
                values.vote_average === '' || values.vote_average === undefined
                    ? null
                    : Number(values.vote_average),
            genre_ids: values.genre_ids ?? [],
        };

        if (editingMovie) {
            await updateMovie.mutateAsync({ id: editingMovie.id, data: payload });
        } else {
            await createMovie.mutateAsync(payload);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingMovie) return;
        await deleteMovie.mutateAsync(deletingMovie.id);
        setDeletingMovie(undefined);
    };

    return (
        <div className="min-h-screen bg-cinema-950">
            <Navbar />

            <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-screen-100">
                            {t('admin.title')}
                        </h1>
                        <p className="text-cinema-400 text-sm mt-1">
                            {t('admin.subtitle')}
                        </p>
                    </div>
                    <Button onClick={openCreate} className="gap-2">
                        <Plus size={16} />
                        {t('admin.addMovie')}
                    </Button>
                </div>

                {isMoviesLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="animate-spin text-reel-400" size={32} />
                    </div>
                ) : movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-cinema-400">
                        <Film size={48} strokeWidth={1} />
                        <p className="text-sm">{t('admin.noMovies')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-border/40">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/40 bg-cinema-900/50">
                                    <th scope="col" className="text-left px-4 py-3 text-cinema-400 font-medium w-16">
                                        {t('admin.poster')}
                                    </th>
                                    <th scope="col" className="text-left px-4 py-3 text-cinema-400 font-medium">
                                        {t('admin.titleCol')}
                                    </th>
                                    <th scope="col" className="text-left px-4 py-3 text-cinema-400 font-medium hidden md:table-cell">
                                        {t('admin.genres')}
                                    </th>
                                    <th scope="col" className="text-left px-4 py-3 text-cinema-400 font-medium w-20 hidden sm:table-cell">
                                        {t('admin.rating')}
                                    </th>
                                    <th scope="col" className="text-left px-4 py-3 text-cinema-400 font-medium w-32 hidden lg:table-cell">
                                        {t('admin.addedOn')}
                                    </th>
                                    <th scope="col" className="px-4 py-3 w-24"><span className="sr-only">{t('admin.actions')}</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map(movie => (
                                    <tr
                                        key={movie.id}
                                        className="border-b border-border/20 hover:bg-cinema-900/30 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            {movie.poster_url ? (
                                                <img
                                                    src={movie.poster_url}
                                                    alt={movie.title}
                                                    className="w-10 h-14 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-cinema-800 rounded flex items-center justify-center">
                                                    <Film size={16} className="text-cinema-500" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="text-screen-100 font-medium line-clamp-2">
                                                {movie.title}
                                            </span>
                                            {movie.release_date && (
                                                <span className="text-cinema-400 text-xs block mt-0.5">
                                                    {movie.release_date.split('-')[0]}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {movie.genres.length > 0 ? (
                                                    movie.genres.map(g => (
                                                        <GenreBadge key={g.id} id={g.id} name={g.name} />
                                                    ))
                                                ) : (
                                                    <span className="text-cinema-500 text-xs italic">—</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            {movie.vote_average != null ? (
                                                <span className="text-reel-400 font-semibold">
                                                    ★ {Number(movie.vote_average).toFixed(1)}
                                                </span>
                                            ) : (
                                                <span className="text-cinema-500 text-xs italic">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-cinema-400 hidden lg:table-cell">
                                            {new Date(movie.created_at).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => openEdit(movie)}
                                                    aria-label={t('admin.editAriaLabel', { title: movie.title })}
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon-sm"
                                                    onClick={() => setDeletingMovie(movie)}
                                                    aria-label={t('admin.deleteAriaLabel', { title: movie.title })}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <MovieFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                movie={editingMovie}
                onSubmit={handleFormSubmit}
            />

            <Dialog open={!!deletingMovie} onOpenChange={open => !open && setDeletingMovie(undefined)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{t('admin.deleteTitle')}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-cinema-300">
                        {t('admin.deleteBody')}{' '}
                        <span className="text-screen-100 font-medium">
                            {deletingMovie?.title}
                        </span>{' '}
                        ? {t('admin.deleteWarning')}
                    </p>
                    <DialogFooter showCloseButton>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleteMovie.isPending}
                        >
                            {deleteMovie.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                t('admin.deleteConfirm')
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <BottomBar />
        </div>
    );
}
