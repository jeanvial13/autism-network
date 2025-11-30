'use client';

import Link from 'next/link';
import { MapPin, BookOpen, Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                        <Brain className="h-8 w-8 text-primary" />
                        <span className="font-semibold text-lg text-foreground">T-Conecta Autismo</span>
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
                    <Link href="/map" className="group relative flex items-center gap-3 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                        <MapPin className="h-4 w-4" />
                        Global Map
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/resources" className="group relative flex items-center gap-3 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                        <BookOpen className="h-4 w-4" />
                        Resources
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/articles" className="group relative flex items-center gap-3 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                        <Brain className="h-4 w-4" />
                        Articles
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-400 transition-all group-hover:w-full"></span>
                    </Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
                    <Link href="/auth/signin">
                        <Button variant="ghost" className="text-sm font-semibold">
                            Sign in
                        </Button>
                    </Link>
                    <Link href="/auth/signin">
                        <Button className="text-sm font-semibold rounded-full">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="space-y-2 px-6 pb-6 pt-2">
                        <Link
                            href="/map"
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Global Map
                        </Link>
                        <Link
                            href="/resources"
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Resources
                        </Link>
                        <Link
                            href="/articles"
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Articles
                        </Link>
                        <div className="mt-6 space-y-2">
                            <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full rounded-full">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
