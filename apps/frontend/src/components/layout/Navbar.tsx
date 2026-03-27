import { Link, NavLink } from 'react-router';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover', end: false },
];

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-cinema-950/80 backdrop-blur-md border-b border-border/50">
      <nav
        className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0">
          <span className="text-reel-400">Cine</span>
          <span className="text-screen-100">Zone</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6" role="list">
          {NAV_LINKS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors duration-200',
                    isActive ? 'text-reel-400' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
