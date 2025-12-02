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
        <div className={cn(
            'rounded-2xl border shadow-lg',
            variants[variant],
            blurs[blur],
            className
        )}>
            {children}
        </div>
    );
}
