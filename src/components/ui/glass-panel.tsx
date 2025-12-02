import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps {
    children: React.ReactNode;
    variant?: 'light' | 'medium' | 'heavy';
    blur?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function GlassPanel({
    children,
    variant = 'medium',
    blur = 'md',
    className
}: GlassPanelProps) {
    const variants = {
        light: 'bg-white/10 dark:bg-white/5 border-white/20',
        medium: 'bg-white/25 dark:bg-white/10 border-white/30',
        heavy: 'bg-white/40 dark:bg-white/20 border-white/40'
    };

    const blurs = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl'
    };

    return (
        <div
            className={cn(
                'rounded-[var(--radius)] border border-[var(--glass-border)] shadow-[var(--glass-shadow)]',
                'transition-all duration-300',
                className
            )}
            style={{
                backgroundColor: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
            }}
        >
            {children}
        </div>
    );
}
