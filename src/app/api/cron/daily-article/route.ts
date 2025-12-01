import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// This route would be triggered by a cron job service (e.g. Vercel Cron, GitHub Actions)
// For security, checking a secret header is recommended in production.

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Check Auth (Skip for MVP demo)
    // const authHeader = req.headers.get('Authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return new NextResponse('Unauthorized', { status: 401 }); }

    try {
        // 2. Fetch latest news (Mocking search for MVP)
        const mockSearchResults = [
            "New study finds early intervention improves outcomes in 90% of cases.",
            "Tech giant launches neurodiversity hiring program.",
            "CDC updates autism prevalence statistics."
        ];

        // 3. Generate Article using AI
        const { text } = await generateText({
            model: openai('gpt-4o'),
            system: 'You are a science journalist specializing in autism.',
            prompt: `Write a short daily news summary based on these headlines: ${mockSearchResults.join('\n')}. 
      Include a section for families and a section for professionals.`,
        });

        // 4. Save to DB (Mocking DB save)
        console.log("Generated Article:", text);

        return NextResponse.json({ success: true, article: text });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Failed to generate article' }, { status: 500 });
    }
}
