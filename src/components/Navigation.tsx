'use client';

import Link from 'next/link';
import { MapPin, BookOpen, Brain, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GlassButton } from '@/components/ui/glass-button';
import { cn } from '@/lib/utils';

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
            <nav className={cn(
                "mx-auto max-w-7xl rounded-full px-6 py-3 transition-all duration-300",
                "bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 shadow-glass-sm",
                "flex items-center justify-between"
            )} aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            TC
                        </div>
                        <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
                            T-Conecta
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
                        Global Map
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/resources" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                        Resources
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/articles" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                        Articles
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
                    <Link href="/auth/signin">
                        <GlassButton variant="ghost" size="sm">
                            Sign in
                        </GlassButton>
                    </Link>
                    <Link href="/auth/signin">
                        <GlassButton variant="primary" size="sm">
                            Get Started
                        </GlassButton>
                    </Link>
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
                                Global Map
                            </Link>
                            <Link
                                href="/resources"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Resources
                            </Link>
                            <Link
                                href="/articles"
                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Articles
                            </Link>
                            <div className="mt-6 space-y-2 pt-4 border-t border-white/10">
                                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                                    <GlassButton variant="secondary" className="w-full justify-center">
                                        Sign in
                                    </GlassButton>
                                </Link>
                                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                                    <GlassButton variant="primary" className="w-full justify-center">
                                        Get Started
                                    </GlassButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
