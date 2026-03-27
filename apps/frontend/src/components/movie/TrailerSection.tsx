import { SectionHeader } from '../ui/SectionHeader';
import type { Video } from '../../types/movie';

interface TrailerSectionProps {
  videos: Video[];
}

export function TrailerSection({ videos }: TrailerSectionProps) {
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official)
    ?? videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    ?? videos.find(v => v.site === 'YouTube');

  if (!trailer) return null;

  return (
    <section aria-labelledby="trailer-heading">
      <SectionHeader title="Trailer" id="trailer-heading" />
      <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden bg-cinema-900 shadow-2xl shadow-cinema-950">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0`}
          title={trailer.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  );
}
