import { useEffect, useRef, useState } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    localMovieSchema,
    type LocalMovieValues,
} from "@/lib/schemas/localMovie";
import { useGenres } from "@/hooks/useMovies";
import type { LocalMovie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface MovieFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    movie?: LocalMovie;
    onSubmit: (
        values: LocalMovieValues,
        setError: UseFormSetError<LocalMovieValues>,
    ) => Promise<void>;
}

interface ImageFieldProps {
    label: string;
    urlFieldName: "poster_url" | "backdrop_url";
    fileFieldName: "poster_file" | "backdrop_file";
    urlInputId: string;
    fileInputId: string;
    urlError?: string;
    currentUrl?: string | null;
    register: ReturnType<typeof useForm<LocalMovieValues>>["register"];
    setValue: ReturnType<typeof useForm<LocalMovieValues>>["setValue"];
}

function ImageField({
    label,
    urlFieldName,
    fileFieldName,
    urlInputId,
    fileInputId,
    urlError,
    currentUrl,
    register,
    setValue,
}: ImageFieldProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
    const [hasFile, setHasFile] = useState(false);

    useEffect(() => {
        if (!hasFile) setPreview(currentUrl ?? null);
    }, [currentUrl, hasFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(fileFieldName, file, { shouldDirty: true });
        setPreview(URL.createObjectURL(file));
        setHasFile(true);
    };

    const clearFile = () => {
        setValue(fileFieldName, undefined, { shouldDirty: true });
        setPreview(currentUrl ?? null);
        setHasFile(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            <div className="flex gap-3 items-start">
                {preview && (
                    <div className="relative shrink-0">
                        <img
                            src={preview}
                            alt=""
                            className="w-16 h-24 object-cover rounded border border-border/40"
                        />
                        {hasFile && (
                            <button
                                type="button"
                                onClick={clearFile}
                                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center"
                                aria-label={t("admin.form.clearImage")}
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-2 flex-1">
                    <Input
                        id={urlInputId}
                        type="url"
                        placeholder="https://..."
                        disabled={hasFile}
                        aria-invalid={!!urlError}
                        className={hasFile ? "opacity-40" : ""}
                        {...register(urlFieldName)}
                    />
                    {urlError && (
                        <p className="text-xs text-destructive">{urlError}</p>
                    )}
                    <div>
                        <input
                            ref={fileInputRef}
                            id={fileInputId}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={12} />
                            {hasFile
                                ? t("admin.form.changeImage")
                                : t("admin.form.uploadImage")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MovieFormDialog({
    open,
    onOpenChange,
    movie,
    onSubmit,
}: MovieFormDialogProps) {
    const { t } = useTranslation();
    const { data: genresData } = useGenres();
    const genres = genresData?.genres ?? [];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        setError,
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
                          overview: movie.overview ?? "",
                          poster_url: movie.poster_url ?? "",
                          poster_file: undefined,
                          backdrop_url: movie.backdrop_url ?? "",
                          backdrop_file: undefined,
                          release_date: movie.release_date ?? "",
                          vote_average: movie.vote_average
                              ? Number(movie.vote_average)
                              : undefined,
                          genre_ids: movie.genres.map((g) => g.id),
                      }
                    : {
                          title: "",
                          overview: "",
                          poster_url: "",
                          poster_file: undefined,
                          backdrop_url: "",
                          backdrop_file: undefined,
                          release_date: "",
                          vote_average: undefined,
                          genre_ids: [],
                      },
            );
        }
    }, [open, movie, reset]);

    const selectedGenreIds = watch("genre_ids") ?? [];

    const toggleGenre = (id: number) => {
        const current = selectedGenreIds;
        setValue(
            "genre_ids",
            current.includes(id)
                ? current.filter((g) => g !== id)
                : [...current, id],
            { shouldDirty: true },
        );
    };

    const handleFormSubmit = async (values: LocalMovieValues) => {
        try {
            await onSubmit(values, setError);
            onOpenChange(false);
        } catch {
            // erreurs déjà gérées dans onSubmit (setError ou toast)
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {movie
                            ? t("admin.form.editTitle")
                            : t("admin.form.addTitle")}
                    </DialogTitle>
                </DialogHeader>

                <form
                    id="movie-form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="flex flex-col gap-4 py-2"
                >
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mf-title">
                            {t("admin.form.titleLabel")}
                        </Label>
                        <Input
                            id="mf-title"
                            placeholder={t("admin.form.titlePlaceholder")}
                            aria-invalid={!!errors.title}
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mf-overview">
                            {t("admin.form.overviewLabel")}
                        </Label>
                        <Textarea
                            id="mf-overview"
                            placeholder={t("admin.form.overviewPlaceholder")}
                            className="min-h-24"
                            aria-invalid={!!errors.overview}
                            {...register("overview")}
                        />
                        {errors.overview && (
                            <p className="text-xs text-destructive">
                                {errors.overview.message}
                            </p>
                        )}
                    </div>

                    <ImageField
                        label={t("admin.form.posterLabel")}
                        urlFieldName="poster_url"
                        fileFieldName="poster_file"
                        urlInputId="mf-poster"
                        fileInputId="mf-poster-file"
                        urlError={errors.poster_url?.message}
                        currentUrl={movie?.poster_url}
                        register={register}
                        setValue={setValue}
                    />

                    <ImageField
                        label={t("admin.form.backdropLabel")}
                        urlFieldName="backdrop_url"
                        fileFieldName="backdrop_file"
                        urlInputId="mf-backdrop"
                        fileInputId="mf-backdrop-file"
                        urlError={errors.backdrop_url?.message}
                        currentUrl={movie?.backdrop_url}
                        register={register}
                        setValue={setValue}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="mf-date">
                                {t("admin.form.releaseDateLabel")}
                            </Label>
                            <Input
                                id="mf-date"
                                type="date"
                                {...register("release_date")}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="mf-rating">
                                {t("admin.form.ratingLabel")}
                            </Label>
                            <Input
                                id="mf-rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                placeholder="7.5"
                                aria-invalid={!!errors.vote_average}
                                {...register("vote_average")}
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
                            <Label>{t("admin.form.genresLabel")}</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                                {genres.map((genre) => (
                                    <label
                                        key={genre.id}
                                        className="flex items-center gap-2 cursor-pointer select-none text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-reel-400"
                                            checked={selectedGenreIds.includes(
                                                genre.id,
                                            )}
                                            onChange={() =>
                                                toggleGenre(genre.id)
                                            }
                                        />
                                        {genre.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                <DialogFooter showCloseButton>
                    <Button
                        type="submit"
                        form="movie-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : movie ? (
                            t("admin.form.save")
                        ) : (
                            t("admin.form.add")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
