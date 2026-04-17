import { Link, NavLink } from "react-router";
import { Bookmark, ClockPlus, Eye, LogOut, ShieldUser, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { RandomMovieButton } from "../ui/RandomMovieButton";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const { t } = useTranslation();

    const NAV_LINKS = [
        { to: "/", label: t('nav.home'), end: true },
        { to: "/discover", label: t('nav.discover'), end: false },
    ];

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-cinema-950/80 backdrop-blur-md border-b border-border/50">
            <nav
                className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between"
                aria-label="Main navigation"
            >
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight shrink-0"
                >
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
                                        "text-sm font-medium transition-colors duration-200",
                                        isActive
                                            ? "text-reel-400"
                                            : "text-muted-foreground hover:text-foreground",
                                    )
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                    <RandomMovieButton />
                </ul>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    {!isLoading &&
                        (isAuthenticated ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <div className="flex items-center gap-2 text-sm text-screen-200">
                                                <User
                                                    size={16}
                                                    className="text-reel-400"
                                                />
                                                <span>{user!.username}</span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40">
                                        {user?.role === "admin" && (
                                            <>
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem className="px-3">
                                                        <ShieldUser size={16} />
                                                        <NavLink
                                                            to="/admin"
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                cn(
                                                                    "text-sm font-medium transition-colors duration-200",
                                                                    isActive
                                                                        ? "text-reel-400"
                                                                        : "text-muted-foreground hover:text-foreground",
                                                                )
                                                            }
                                                        >
                                                            {t('nav.admin')}
                                                        </NavLink>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="px-0">
                                                <Link
                                                    to="/profile"
                                                    className="w-full"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full justify-start hover:text-reel-400 hover:bg-transparent"
                                                    >
                                                        <User size={16} />
                                                        {t('nav.profile')}
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="px-0">
                                                <Link
                                                    to="/favorites"
                                                    className="w-full"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full justify-start hover:text-reel-400 hover:bg-transparent"
                                                    >
                                                        <Bookmark size={16} />
                                                        {t('nav.favorites')}
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="px-0">
                                                <Link
                                                    to="/watchlist"
                                                    className="w-full"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full justify-start hover:text-reel-400 hover:bg-transparent"
                                                    >
                                                        <ClockPlus size={16} />
                                                        {t('nav.watchlist')}
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="px-0">
                                                <Link
                                                    to="/history"
                                                    className="w-full"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full justify-start hover:text-reel-400 hover:bg-transparent"
                                                    >
                                                        <Eye size={16} />
                                                        {t('nav.history')}
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={logout}
                                                className="w-full justify-start hover:text-reel-400 hover:bg-transparent"
                                            >
                                                <LogOut size={16} />
                                                {t('nav.logOut')}
                                            </Button>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                                    {t('nav.logIn')}
                                </Link>
                                <Link to="/register" className={buttonVariants({ size: 'sm' })}>
                                    {t('nav.signUp')}
                                </Link>
                            </>
                        ))}
                </div>
            </nav>
        </header>
    );
}
