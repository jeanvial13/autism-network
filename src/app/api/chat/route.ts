import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openai('gpt-4o'),
        messages,
        system: 'You are the Autism Network Guide, a helpful, empathetic, and strictly evidence-based Virtual Assistant. Provide accurate scientific information about autism. Do not recommend pseudoscience or provide medical advice. Always cite reputable sources when possible.',
    });

    return result.toTextStreamResponse();
}
