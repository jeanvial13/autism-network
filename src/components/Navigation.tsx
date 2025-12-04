'use client';

import Link from 'next/link';
import { MapPin, BookOpen, Brain, Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GlassButton } from '@/components/ui/glass-button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const t = useTranslations('navigation');
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
            scrolled ? "py-2" : "py-4"
        )}>
            <nav
                className={cn(
                    "mx-auto max-w-7xl rounded-full px-6 py-3 transition-all duration-300",
                    "border border-[var(--glass-border)] shadow-[var(--glass-shadow)]",
                    "flex items-center justify-between"
                )}
                style={{
                    backgroundColor: 'var(--glass-bg)',
                    backdropFilter: 'var(--glass-blur)',
                    WebkitBackdropFilter: 'var(--glass-blur)',
                }}
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            TC
                        </div>
                        <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
                            {t('brand')}
                        </span>
                    </Link>
                </div>

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-8">
                    <Link href="/map" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                        {t('globalMap')}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/resources" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                        {t('resources')}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/articles" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                        {t('articles')}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/pictogramas" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                        {t('pictograms')}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <GlassButton variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-white/20">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                        <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                </GlassButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER && ( // Simple check, ideally use role
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/dashboard">
                                            <Brain className="mr-2 h-4 w-4" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: window.location.origin })}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-4 right-4 mt-2">
                    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 p-6 shadow-xl">
                        <div className="space-y-4">
                            <Link
                                href="/map"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('globalMap')}
                            </Link>
                            <Link
                                href="/resources"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('resources')}
                            </Link>
                            <Link
                                href="/articles"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('articles')}
                            </Link>
                            <Link
                                href="/pictogramas"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('pictograms')}
                            </Link>
                            <div className="mt-6 space-y-2 pt-4 border-t border-white/10">
                                {session ? (
                                    <>
                                        <div className="px-3 py-2">
                                            <p className="text-sm font-medium">{session.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                                        </div>
                                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                                            <GlassButton variant="ghost" className="w-full justify-start">
                                                <User className="mr-2 h-4 w-4" />
                                                Perfil
                                            </GlassButton>
                                        </Link>
                                        <GlassButton variant="secondary" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => signOut({ callbackUrl: window.location.origin })}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Cerrar Sesión
                                        </GlassButton>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
