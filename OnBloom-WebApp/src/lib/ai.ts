import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createPerplexity } from "@ai-sdk/perplexity";

// Initialize OpenRouter provider
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.helicone.ai/api/v1",
  headers: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Helicone-Cache-Enabled": "true",
    "Helicone-LLM-Security-Enabled": "true",
    "Helicone-LLM-Security-Advanced": "true",
  },
});

// Initialize Perplexity provider
export const perplexity = createPerplexity({
  apiKey: process.env.PPLX_API_KEY,
});

// Export commonly used models
export const models = {
  // Claude models
  claude35Sonnet: openrouter.chat("anthropic/claude-3.5-sonnet"),
  claude3Opus: openrouter.chat("anthropic/claude-3-opus"),
  claude3Haiku: openrouter.chat("anthropic/claude-3-haiku"),
  claude37SonnetThinking: openrouter.chat("anthropic/claude-3.7-sonnet:thinking"),

  // GPT models
  gpt4Turbo: openrouter.chat("openai/gpt-4-turbo"),
  gpt4: openrouter.chat("openai/gpt-4"),
  gpt35Turbo: openrouter.chat("openai/gpt-3.5-turbo"),

  // Llama models
  llama31_405b: openrouter.chat("meta-llama/llama-3.1-405b-instruct"),
  llama31_70b: openrouter.chat("meta-llama/llama-3.1-70b-instruct"),

  // Other models
  mixtral8x7b: openrouter.chat("mistralai/mixtral-8x7b-instruct"),
  geminiPro: openrouter.chat("google/gemini-pro"),

  // Perplexity models
  perplexityDeepResearch: perplexity("sonar-deep-research"),
  perplexityReasoningPro: perplexity("sonar-reasoning-pro"),
  perplexityReasoning: perplexity("sonar-reasoning"),
  perplexityPro: perplexity("sonar-pro"),
  perplexity: perplexity("sonar"),
} as const;

// Default model for general use
export const defaultModel = models.claude35Sonnet;
