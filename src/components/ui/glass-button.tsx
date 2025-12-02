import { cn } from "@/lib/utils";
import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export function GlassButton({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}: GlassButtonProps) {
    const variants = {
        primary: 'bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl border-transparent',
        secondary: 'bg-white/10 hover:bg-white/20 text-foreground border-white/30 backdrop-blur-md',
        ghost: 'hover:bg-white/10 text-foreground border-transparent',
        outline: 'border-white/30 hover:bg-white/10 text-foreground backdrop-blur-sm'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm min-h-[36px]',
        md: 'px-6 py-3 text-base min-h-[44px]',
        lg: 'px-8 py-4 text-lg min-h-[56px]'
    };

    return (
        <button
            className={cn(
                'rounded-full font-medium transition-all duration-300 border',
                'active:scale-95 flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
