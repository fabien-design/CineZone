import { getProfileUrl } from '../../lib/tmdb';
import { SectionHeader } from '../ui/SectionHeader';
import type { CastMember } from '../../types/movie';

interface CastCardProps {
  member: CastMember;
}

function CastCard({ member }: CastCardProps) {
  return (
    <div className="flex flex-col items-center text-center w-24 shrink-0">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-cinema-800 border-2 border-cinema-700 mb-2 shrink-0">
        <img
          src={getProfileUrl(member.profile_path)}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-screen-100 text-xs font-medium line-clamp-2 leading-tight">
        {member.name}
      </p>
      <p className="text-cinema-400 text-xs line-clamp-1 mt-0.5">
        {member.character}
      </p>
    </div>
  );
}

interface CastSectionProps {
  cast: CastMember[];
}

export function CastSection({ cast }: CastSectionProps) {
  return (
    <section aria-labelledby="cast-heading">
      <SectionHeader title="Cast" id="cast-heading" />
      <div className="overflow-x-auto pb-3 -mx-4 px-4 md:-mx-0 md:px-0">
        <div className="flex gap-5 w-max">
          {cast.map(member => (
            <CastCard key={`${member.id}-${member.character}`} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
