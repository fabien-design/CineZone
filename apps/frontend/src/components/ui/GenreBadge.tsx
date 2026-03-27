import { Link } from 'react-router';
import { Badge } from './badge';
import { cn } from '../../lib/utils';

interface GenreBadgeProps {
  id: number;
  name: string;
  className?: string;
  asLink?: boolean;
}

export function GenreBadge({ id, name, className, asLink = false }: GenreBadgeProps) {
  const classes = cn(
    'border-reel-500/40 text-reel-300 bg-reel-500/10 hover:bg-reel-500/20 hover:border-reel-400',
    className,
  );

  if (asLink) {
    return (
      <Link to={`/discover?genre=${id}`}>
        <Badge variant="outline" className={classes}>
          {name}
        </Badge>
      </Link>
    );
  }

  return (
    <Badge variant="outline" className={classes}>
      {name}
    </Badge>
  );
}
