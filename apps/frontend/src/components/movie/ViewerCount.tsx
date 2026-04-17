import { Eye } from 'lucide-react';
import { useViewers } from '@/hooks/useViewers';
import type { MovieRef } from '@/types/movie';

export function ViewerCount({ movieRef }: { movieRef: MovieRef }) {
    const count = useViewers(movieRef);

    if (count <= 1) return null;

    return (
        <div
            className="flex items-center gap-1.5 text-xs text-cinema-400"
            aria-live="polite"
            aria-label={`${count} people watching right now`}
        >
            <Eye size={13} className="text-reel-400" />
            <span>
                <span className="text-reel-400 font-medium">{count}</span>
                {' '}watching right now
            </span>
        </div>
    );
}
