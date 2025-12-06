"use client";

import { useState } from "react";
import { Brain, Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export function ArticleGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleGenerate = async () => {
        setIsLoading(true);
        setStatus("loading");
        setMessage("Buscando las noticias más recientes y relevantes...");

        try {
            const response = await fetch("/api/cron/discover-articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-cron-secret": "MY_TEMPORARY_SECRET_123" // Temporary bypass
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error generando artículos");
            }

            setStatus("success");
            setMessage(`¡Éxito! Se han generado ${data.count} nuevos artículos.`);

            // Auto refresh after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage("Error al generar artículos. Intenta de nuevo.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 p-6 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                            <Brain className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Noticias IA Recientes
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Descubre los 4 artículos más importantes y recientes sobre autismo.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {status === "loading" && (
                            <div className="flex items-center gap-2 text-sm text-indigo-600 animate-pulse bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-100">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                {message}
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50/50 px-3 py-1 rounded-full border border-green-100">
                                <Sparkles className="h-3 w-3" />
                                {message}
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50/50 px-3 py-1 rounded-full border border-red-100">
                                <AlertCircle className="h-3 w-3" />
                                {message}
                            </div>
                        )}

                        <GlassButton
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Generando...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    ✨ Actualizar Noticias
                                </>
                            )}
                        </GlassButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
