import { generateText, generateObject } from 'ai';
import { z } from 'zod';
import { models } from '@/lib/ai';

export async function POST(req: Request) {
  const { prompt, type = 'text' } = await req.json();

  try {
    if (type === 'object') {
      // Example: Generate structured data (e.g., employee onboarding tasks)
      const result = await generateObject({
        model: models.claude35Sonnet,
        schema: z.object({
          tasks: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            priority: z.enum(['high', 'medium', 'low']),
            category: z.string(),
            estimatedTime: z.string(),
          })),
        }),
        prompt: prompt || 'Generate a list of onboarding tasks for a new software engineer.',
      });

      return Response.json({ object: result.object });
    } else {
      // Default: Generate text
      const result = await generateText({
        model: models.claude35Sonnet,
        prompt,
      });

      return Response.json({ text: result.text });
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return Response.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}