import { Link, useLocation } from 'react-router';
import { LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { SectionHeader } from '../ui/SectionHeader';
import { RatingForm } from './RatingForm';
import type { RatingValues } from '@/lib/schemas/rating';

interface UserActionsProps {
  isAuthenticated: boolean;
  initialRating?: number;
  initialComment?: string;
  onSubmitRating: (values: RatingValues) => Promise<void>;
  onDeleteReview: () => Promise<void>;
}

function UnauthenticatedPrompt() {
  const location = useLocation();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-cinema-800/50 border border-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <LogIn size={20} className="text-reel-400 shrink-0" />
        <p className="text-screen-200 text-sm">
          Sign in to save this movie to your lists and leave a rating.
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <Button variant="outline" size="sm">
          <Link to={`/login?redirectTo=${encodeURIComponent(currentPath)}`}>Login</Link>
        </Button>
        <Button size="sm">
          <Link to={`/register?redirectTo=${encodeURIComponent(currentPath)}`}>Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}

export function UserActions({
  isAuthenticated,
  initialRating = 0,
  initialComment = '',
  onSubmitRating,
  onDeleteReview,
}: UserActionsProps) {
  return (
    <section aria-labelledby="user-actions-heading">
      <SectionHeader title="Your Activity" id="user-actions-heading" />

      {!isAuthenticated ? (
        <UnauthenticatedPrompt />
      ) : (
        <div className="bg-cinema-800/40 border border-border rounded-xl p-6 flex flex-col gap-6">
          <RatingForm
            initialRating={initialRating}
            initialComment={initialComment}
            onSubmitForm={onSubmitRating}
            onDeleteReview={onDeleteReview}
            onSuccess={() => {}}
          />
        </div>
      )}
    </section>
  );
}
