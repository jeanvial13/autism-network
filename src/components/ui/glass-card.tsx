import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hover?: boolean;
    className?: string;
}

export function GlassCard({ children, hover = true, className, ...props }: GlassCardProps) {
    return (
        <GlassPanel
            variant="medium"
            className={cn(
                'p-6 transition-all duration-300',
                hover && 'hover:scale-[1.02] hover:shadow-xl cursor-pointer hover:bg-white/30 dark:hover:bg-white/15',
                className
            )}
            {...props}
        >
            {children}
        </GlassPanel>
    );
}
