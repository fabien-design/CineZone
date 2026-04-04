import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratingSchema, type RatingValues } from "@/lib/schemas/rating";
import { StarRating } from "../ui/StarRating";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface RatingFormProps {
    initialRating?: number;
    initialComment?: string;
    onSubmitForm: (values: RatingValues) => Promise<void>;
    onSuccess: () => void;
}

export function RatingForm({
    initialRating = 0,
    initialComment = "",
    onSubmitForm,
    onSuccess,
}: RatingFormProps) {
    const [serverError, setServerError] = useState("");

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
        setServerError("");
        try {
            await onSubmitForm(values);
            onSuccess();
        } catch {
            setServerError("An error occurred while submitting your rating. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
                <p className="text-screen-200 text-sm font-medium mb-3">Your Rating</p>
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <StarRating value={field.value} onChange={field.onChange} />
                    )}
                />
                {errors.rating && (
                    <p className="text-xs text-destructive mt-1">{errors.rating.message}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="comment"
                    className="text-screen-200 text-sm font-medium block mb-2"
                >
                    Review{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                    id="comment"
                    placeholder="Share your thoughts about this movie…"
                    rows={3}
                    className="bg-cinema-900 border-cinema-700 focus-visible:ring-reel-500 resize-none"
                    {...register("comment")}
                />
                {errors.comment && (
                    <p className="text-xs text-destructive mt-1">{errors.comment.message}</p>
                )}
            </div>

            {serverError && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {serverError}
                </p>
            )}

            <Button
                type="submit"
                disabled={currentRating === 0 || isSubmitting}
                className="self-start"
            >
                {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                ) : initialRating > 0 ? (
                    "Update Rating"
                ) : (
                    "Submit Rating"
                )}
            </Button>
        </form>
    );
}
