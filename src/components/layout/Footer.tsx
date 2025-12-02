"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('navigation');

    return (
        <footer className="relative mt-20 border-t border-[var(--glass-border)]">
            <div className="absolute inset-0 bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] -z-10" />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                TC
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground">
                                {t('brand')}
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            Conectando familias y profesionales para un futuro más inclusivo y comprensivo.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Plataforma</h3>
                        <ul className="space-y-2">
                            <li><Link href="/map" className="text-muted-foreground hover:text-primary transition-colors">{t('globalMap')}</Link></li>
                            <li><Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">{t('resources')}</Link></li>
                            <li><Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors">{t('articles')}</Link></li>
                            <li><Link href="/pictogramas" className="text-muted-foreground hover:text-primary transition-colors">{t('pictograms')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacidad</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Términos</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} T-Conecta Autismo. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
