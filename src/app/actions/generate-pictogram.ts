'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePictogram(prompt: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not defined');
    }

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `A simple, child-friendly, minimalist pictogram illustration of "${prompt}". White background, thick distinct lines, flat colors, easy to understand for a child with autism. No text.`,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        const image = response.data[0].b64_json;
        if (!image) throw new Error('No image generated');

        return `data:image/png;base64,${image}`;
    } catch (error) {
        console.error('Error generating pictogram:', error);
        throw new Error('Failed to generate pictogram');
    }
}
