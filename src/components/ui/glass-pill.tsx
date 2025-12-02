import { cn } from "@/lib/utils";
import React from "react";

interface GlassPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    active?: boolean;
}

export function GlassPill({ children, active = false, className, ...props }: GlassPillProps) {
    return (
        <button
            className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                'border backdrop-blur-md whitespace-nowrap',
                active
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-foreground border-white/30 hover:border-white/50',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
