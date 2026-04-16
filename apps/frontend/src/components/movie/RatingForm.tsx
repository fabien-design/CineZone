import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ratingSchema, type RatingValues } from "@/lib/schemas/rating";
import { StarRating } from "../ui/StarRating";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function DeleteConfirmationDialog({ onConfirm }: { onConfirm: () => void }) {
    const { t } = useTranslation();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-destructive">
                    {t('rating.remove')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('rating.confirmTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('rating.confirmText')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t('rating.cancel')}</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={onConfirm}>
                        {t('rating.yesRemove')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface RatingFormProps {
    initialRating?: number;
    initialComment?: string;
    onSubmitForm: (values: RatingValues) => Promise<void>;
    onDeleteReview: () => Promise<void>;
    onSuccess: () => void;
}

export function RatingForm({
    initialRating = 0,
    initialComment = "",
    onSubmitForm,
    onDeleteReview,
    onSuccess,
}: RatingFormProps) {
    const { t } = useTranslation();
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RatingValues>({
        resolver: zodResolver(ratingSchema),
        defaultValues: { rating: initialRating, comment: initialComment },
    });

    const currentRating = watch("rating");

    const onSubmit = async (values: RatingValues) => {
        try {
            await onSubmitForm(values);
            toast.success(initialRating > 0 ? t('rating.updated') : t('rating.submitted'));
            onSuccess();
        } catch {
            // axios interceptor already shows the error toast
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
                <p className="text-screen-200 text-sm font-medium mb-3">
                    {t('rating.yourRating')}
                </p>
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <StarRating
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                {errors.rating && (
                    <p className="text-xs text-destructive mt-1">
                        {errors.rating.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="comment"
                    className="text-screen-200 text-sm font-medium block mb-2"
                >
                    {t('rating.review')}{" "}
                    <span className="text-muted-foreground font-normal">
                        {t('rating.optional')}
                    </span>
                </label>
                <Textarea
                    id="comment"
                    placeholder={t('rating.placeholder')}
                    rows={3}
                    className="bg-cinema-900 border-cinema-700 focus-visible:ring-reel-500 resize-none"
                    {...register("comment")}
                />
                {errors.comment && (
                    <p className="text-xs text-destructive mt-1">
                        {errors.comment.message}
                    </p>
                )}
            </div>

            <div className="flex gap-3 items-center">
                <Button
                    type="submit"
                    disabled={currentRating === 0 || isSubmitting}
                    className="self-start"
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : initialRating > 0 ? (
                        t('rating.update')
                    ) : (
                        t('rating.submit')
                    )}
                </Button>
                {initialRating > 0 &&
                    DeleteConfirmationDialog({ onConfirm: onDeleteReview })}
            </div>
        </form>
    );
}
