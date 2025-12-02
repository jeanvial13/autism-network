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
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg hover:shadow-xl hover:scale-[1.02] border-transparent',
        secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--glass-border)] hover:bg-[var(--glass-highlight)]',
        ghost: 'hover:bg-[var(--glass-highlight)] text-foreground border-transparent',
        outline: 'border-[var(--glass-border)] hover:bg-[var(--glass-highlight)] text-foreground'
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
                'backdrop-blur-md',
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
