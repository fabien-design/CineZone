import { useState } from "react";
import { useNavigate } from "react-router";
import { Shuffle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { moviesApi } from "@/api/movies";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function RandomMovieButton({
    variant = "navbar",
    className,
}: {
    variant?: "navbar" | "bottombar";
    className?: string;
}) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRandom = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const movie = await moviesApi.getRandom();
            navigate(`/movies/${movie.id}`);
        } catch {
            toast.error(t('random.error'));
        } finally {
            setLoading(false);
        }
    };

    if (variant === "bottombar") {
        return (
            <button
                onClick={handleRandom}
                disabled={loading}
                aria-label={t('random.ariaLabel')}
                className={cn(
                    "flex flex-col items-center justify-center gap-1 px-4 py-2 text-sm transition-colors",
                    "hover:text-gray-600 disabled:opacity-50",
                    className,
                )}
            >
                {loading
                    ? <Loader2 size={24} className="animate-spin" />
                    : <Shuffle size={24} />
                }
                <span className="text-xs">{t('random.label')}</span>
            </button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleRandom}
            disabled={loading}
            aria-label={t('random.ariaLabel')}
            className={cn("gap-2", className)}
        >
            {loading
                ? <Loader2 size={15} className="animate-spin" />
                : <Shuffle size={15} />
            }
            {t('random.label')}
        </Button>
    );
}
