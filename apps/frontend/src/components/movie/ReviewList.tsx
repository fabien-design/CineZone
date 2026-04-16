import { Star, MessageSquare } from "lucide-react";
import type { Rating } from "@/api/ratings";

function StarScore({ score }: { score: number }) {
    return (
        <span className="flex items-center gap-1 text-reel-400 font-semibold text-sm">
            <Star size={14} fill="currentColor" />
            {score}
            <span className="text-cinema-500 font-normal">/10</span>
        </span>
    );
}

function ReviewCard({ rating }: { rating: Rating }) {
    const date = new Date(rating.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <article className="flex flex-col gap-2 bg-cinema-900 border border-cinema-700 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-reel-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {rating.username[0].toUpperCase()}
                    </div>
                    <span className="text-screen-200 text-sm font-medium">
                        {rating.username}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <StarScore score={rating.score} />
                    <span className="text-cinema-500 text-xs">{date}</span>
                </div>
            </div>

            {rating.comment && (
                <p className="text-screen-400 text-sm leading-relaxed pl-9">
                    {rating.comment}
                </p>
            )}
        </article>
    );
}

interface ReviewListProps {
    ratings: Rating[];
    isLoading: boolean;
}

export function ReviewList({ ratings, isLoading }: ReviewListProps) {
    if (isLoading) {
        // Show skeleton loaders while fetching reviews
        return (
            <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-16 rounded-xl bg-cinema-900 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (ratings.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-cinema-500">
                <MessageSquare size={28} />
                <p className="text-sm">No reviews yet. Be the first!</p>
            </div>
        );
    }

    const avg = (
        ratings.reduce((s, r) => s + r.score, 0) / ratings.length
    ).toFixed(1);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-screen-300 text-sm">
                <Star size={15} className="text-reel-400" fill="currentColor" />
                <span>
                    <span className="text-screen-100 font-semibold text-base">
                        {avg}
                    </span>
                    /10 - {ratings.length}{" "}
                    {ratings.length === 1 ? "review" : "reviews"}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {ratings.map((r) => (
                    <ReviewCard key={r.id} rating={r} />
                ))}
            </div>
        </div>
    );
}
