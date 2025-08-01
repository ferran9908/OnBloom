import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { employee } = await req.json();

    const prompt = `You are analyzing the onboarding needs for ${employee.name}, a ${employee.role} in the ${employee.department} department starting on ${employee.startDate}.

Think through what this person needs to be successful:
1. Who are the key people they need to meet and why?
2. What processes and documentation should they review?
3. What training would be most valuable for their role?
4. What system access do they need on day one?

Consider their specific role responsibilities and how they'll interact with different teams...`;

    const result = await streamText({
      model: openrouter("anthropic/claude-3.5-sonnet"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error streaming onboarding analysis:", error);
    return new Response("Failed to analyze onboarding needs", { status: 500 });
  }
}