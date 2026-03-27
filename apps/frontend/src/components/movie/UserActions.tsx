import { useState } from 'react';
import { Link } from 'react-router';
import { Heart, Bookmark, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { StarRating } from '../ui/StarRating';
import { SectionHeader } from '../ui/SectionHeader';

interface UserActionsProps {
  isAuthenticated: boolean;
  isFavorite: boolean;
  isInWatchlist: boolean;
  userRating: number;
  onToggleFavorite: () => void;
  onToggleWatchlist: () => void;
  onSubmitRating: (rating: number, comment: string) => void;
}

function UnauthenticatedPrompt() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-cinema-800/50 border border-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <LogIn size={20} className="text-reel-400 shrink-0" />
        <p className="text-screen-200 text-sm">
          Sign in to save this movie to your lists and leave a rating.
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <Button variant="outline" size="sm" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/register">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}

interface RatingFormProps {
  initialRating: number;
  onSubmit: (rating: number, comment: string) => void;
}

function RatingForm({ initialRating, onSubmit }: RatingFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <p className="text-screen-200 text-sm font-medium mb-3">Your Rating</p>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="comment" className="text-screen-200 text-sm font-medium block mb-2">
          Review{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your thoughts about this movie…"
          rows={3}
          className="bg-cinema-900 border-cinema-700 focus-visible:ring-reel-500 resize-none"
        />
      </div>

      <Button type="submit" disabled={rating === 0} className="self-start">
        {initialRating > 0 ? 'Update Rating' : 'Submit Rating'}
      </Button>
    </form>
  );
}

export function UserActions({
  isAuthenticated,
  isFavorite,
  isInWatchlist,
  userRating,
  onToggleFavorite,
  onToggleWatchlist,
  onSubmitRating,
}: UserActionsProps) {
  return (
    <section aria-labelledby="user-actions-heading">
      <SectionHeader title="Your Activity" id="user-actions-heading" />

      {!isAuthenticated ? (
        <UnauthenticatedPrompt />
      ) : (
        <div className="bg-cinema-800/40 border border-border rounded-xl p-6 flex flex-col gap-6">
          {/* Save actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              className={cn(
                'gap-2 transition-colors duration-200',
                isFavorite
                  ? 'border-curtain-500 text-curtain-300 bg-curtain-600/10 hover:bg-curtain-600/20'
                  : 'hover:border-curtain-500 hover:text-curtain-300',
              )}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>

            <Button
              variant="outline"
              onClick={onToggleWatchlist}
              aria-pressed={isInWatchlist}
              className={cn(
                'gap-2 transition-colors duration-200',
                isInWatchlist
                  ? 'border-reel-500 text-reel-300 bg-reel-500/10 hover:bg-reel-500/20'
                  : 'hover:border-reel-500 hover:text-reel-300',
              )}
            >
              <Bookmark size={16} fill={isInWatchlist ? 'currentColor' : 'none'} />
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>

          <Separator className="bg-border" />

          <RatingForm initialRating={userRating} onSubmit={onSubmitRating} />
        </div>
      )}
    </section>
  );
}
