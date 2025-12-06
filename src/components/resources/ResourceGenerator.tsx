'use client';

import { useState } from 'react';
import { Download, Sparkles, RefreshCw } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';

export function ResourceGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleGenerate = async () => {
        setIsLoading(true);
        setStatus('idle');

        try {
            // Call the endpoint. Note: In production, this should be protected.
            // For now, we assume the route allows it or we pass a known secret if needed.
            const res = await fetch('/api/cron/discover-resources?secret=MY_TEMPORARY_SECRET_123');
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to generate');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-2xl border border-border/50 backdrop-blur-sm mb-8">
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Resource Discovery
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Use our AI agent to discover and verify new autism educational resources from the web.
                </p>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
                    px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}
                    ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
                    ${status === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}
                    ${status === 'idle' && !isLoading ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/25' : ''}
                `}
            >
                {isLoading ? (
                    <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Scanning Web...
                    </>
                ) : status === 'success' ? (
                    <>
                        ✅ Resources Found!
                    </>
                ) : status === 'error' ? (
                    <>
                        ❌ Error (Try Again)
                    </>
                ) : (
                    <>
                        ✨ Generate New Resources
                    </>
                )}
            </button>
        </div>
    );
}
