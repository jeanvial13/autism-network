import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface GlassSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
}

const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
    ({ className, children, label, ...props }, ref) => {
        return (
            <div className="relative">
                {label && (
                    <label className="absolute -top-5 left-1 text-xs font-medium text-muted-foreground">
                        {label}
                    </label>
                )}
                <select
                    className={cn(
                        "flex h-10 w-full appearance-none items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-md dark:bg-black/10 dark:border-white/10 text-foreground transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/20 cursor-pointer",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
        )
    }
)
GlassSelect.displayName = "GlassSelect"

export { GlassSelect }
