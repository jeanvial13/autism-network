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
            <div className="relative w-full group">
                {label && (
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-11 w-full appearance-none items-center justify-between rounded-xl border border-white/20 bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-md transition-all duration-300 hover:bg-background/70 cursor-pointer shadow-sm",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        )
    }
)
GlassSelect.displayName = "GlassSelect"

export { GlassSelect }
