import { cn } from "@/lib/utils";
import Link from "next/link";
import { GlassButton } from "./glass-button";
import { Menu } from "lucide-react";

export function GlassNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className={cn(
                'mx-auto max-w-7xl rounded-full px-6 py-3',
                'bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20',
                'flex items-center justify-between shadow-glass-sm'
            )}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                        TC
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
                        T-Conecta
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/map" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Map
                    </Link>
                    <Link href="/articles" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Articles
                    </Link>
                    <Link href="/resources" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Resources
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <GlassButton variant="primary" size="sm" className="hidden sm:flex">
                        Get Support
                    </GlassButton>
                    <GlassButton variant="ghost" size="sm" className="md:hidden px-2">
                        <Menu className="w-5 h-5" />
                    </GlassButton>
                </div>
            </div>
        </nav>
    );
}
