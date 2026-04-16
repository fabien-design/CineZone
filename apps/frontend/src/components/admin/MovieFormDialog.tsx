import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { localMovieSchema, type LocalMovieValues } from '@/lib/schemas/localMovie';
import { useGenres } from '@/hooks/useMovies';
import type { LocalMovie } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface MovieFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    movie?: LocalMovie;
    onSubmit: (values: LocalMovieValues) => Promise<void>;
}

export function MovieFormDialog({ open, onOpenChange, movie, onSubmit }: MovieFormDialogProps) {
    const { t } = useTranslation();
    const { data: genresData } = useGenres();
    const genres = genresData?.genres ?? [];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LocalMovieValues>({
        resolver: zodResolver(localMovieSchema),
    });

    useEffect(() => {
        if (open) {
            reset(
                movie
                    ? {
                          title: movie.title,
                          overview: movie.overview ?? '',
                          poster_url: movie.poster_url ?? '',
                          backdrop_url: movie.backdrop_url ?? '',
                          release_date: movie.release_date ?? '',
                          vote_average: movie.vote_average ?? '',
                          genre_ids: movie.genres.map(g => g.id),
                      }
                    : {
                          title: '',
                          overview: '',
                          poster_url: '',
                          backdrop_url: '',
                          release_date: '',
                          vote_average: '',
                          genre_ids: [],
                      },
            );
        }
    }, [open, movie, reset]);

    const selectedGenreIds = watch('genre_ids') ?? [];

    const toggleGenre = (id: number) => {
        const current = selectedGenreIds;
        setValue(
            'genre_ids',
            current.includes(id) ? current.filter(g => g !== id) : [...current, id],
            { shouldDirty: true },
        );
    };

    const handleFormSubmit = async (values: LocalMovieValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {movie ? t('admin.form.editTitle') : t('admin.form.addTitle')}
                    </DialogTitle>
                </DialogHeader>

                <form
                    id="movie-form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="flex flex-col gap-4 py-2"
                >
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mf-title">{t('admin.form.titleLabel')}</Label>
                        <Input
                            id="mf-title"
                            placeholder={t('admin.form.titlePlaceholder')}
                            aria-invalid={!!errors.title}
                            {...register('title')}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mf-overview">{t('admin.form.overviewLabel')}</Label>
                        <Textarea
                            id="mf-overview"
                            placeholder={t('admin.form.overviewPlaceholder')}
                            className="min-h-24"
                            {...register('overview')}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mf-poster">{t('admin.form.posterLabel')}</Label>
                        <Input
                            id="mf-poster"
                            type="url"
                            placeholder="https://..."
                            aria-invalid={!!errors.poster_url}
                            {...register('poster_url')}
                        />
                        {errors.poster_url && (
                            <p className="text-xs text-destructive">{errors.poster_url.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mf-backdrop">{t('admin.form.backdropLabel')}</Label>
                        <Input
                            id="mf-backdrop"
                            type="url"
                            placeholder="https://..."
                            aria-invalid={!!errors.backdrop_url}
                            {...register('backdrop_url')}
                        />
                        {errors.backdrop_url && (
                            <p className="text-xs text-destructive">{errors.backdrop_url.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="mf-date">{t('admin.form.releaseDateLabel')}</Label>
                            <Input id="mf-date" type="date" {...register('release_date')} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="mf-rating">{t('admin.form.ratingLabel')}</Label>
                            <Input
                                id="mf-rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                placeholder="7.5"
                                aria-invalid={!!errors.vote_average}
                                {...register('vote_average')}
                            />
                            {errors.vote_average && (
                                <p className="text-xs text-destructive">
                                    {errors.vote_average.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {genres.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Label>{t('admin.form.genresLabel')}</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                                {genres.map(genre => (
                                    <label
                                        key={genre.id}
                                        className="flex items-center gap-2 cursor-pointer select-none text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-reel-400"
                                            checked={selectedGenreIds.includes(genre.id)}
                                            onChange={() => toggleGenre(genre.id)}
                                        />
                                        {genre.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                <DialogFooter showCloseButton>
                    <Button type="submit" form="movie-form" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : movie ? (
                            t('admin.form.save')
                        ) : (
                            t('admin.form.add')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
