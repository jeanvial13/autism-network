'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Loader2 } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        // Sanitize callbackUrl to prevent 0.0.0.0 issues
        let sanitizedCallbackUrl = callbackUrl;
        if (sanitizedCallbackUrl.includes("0.0.0.0")) {
            try {
                const urlObj = new URL(sanitizedCallbackUrl);
                sanitizedCallbackUrl = urlObj.pathname + urlObj.search;
            } catch {
                sanitizedCallbackUrl = "/";
            }
        }

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
                callbackUrl: sanitizedCallbackUrl,
            });

            if (result?.error) {
                setError("Credenciales inválidas. Por favor intenta de nuevo.");
                setIsLoading(false);
            } else {
                // Force a hard navigation to ensure session is picked up and we don't hang
                window.location.href = sanitizedCallbackUrl;
            }
        } catch (error) {
            setError("Ocurrió un error. Por favor intenta de nuevo.");
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-background">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/" className="flex items-center justify-center gap-2 mb-6">
                    <Brain className="h-10 w-10 text-primary" />
                </Link>
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
                    Iniciar Sesión
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    O{" "}
                    <Link
                        href="/auth/signup"
                        className="font-semibold text-primary hover:text-primary/80"
                    >
                        crear una nueva cuenta
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={onSubmit}>
                    <div>
                        <Label htmlFor="username">Usuario</Label>
                        <div className="mt-2">
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="text-sm">
                                <Link
                                    href="#"
                                    className="font-semibold text-primary hover:text-primary/80"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
