'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';

export default function ChatInterface() {
    const { messages, sendMessage, status } = useChat();

    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sendMessage({ role: 'user', content: input } as any);
        setInput('');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20">
                    <CardHeader className="bg-primary/5 border-b p-4 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg text-primary">Autism Network Guide</CardTitle>
                            <p className="text-xs text-muted-foreground">Virtual Assistant (Beta)</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-grow p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground mt-10 text-sm">
                                    <p>Hello! I can help you find information, resources, or local support.</p>
                                    <p className="mt-2 text-xs">I am a virtual assistant, not a doctor.</p>
                                </div>
                            )}

                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {messages.map((m: any) => (
                                <div key={m.id} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${m.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-background">
                        <form onSubmit={handleSubmit} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask a question..."
                                className="flex-grow"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
