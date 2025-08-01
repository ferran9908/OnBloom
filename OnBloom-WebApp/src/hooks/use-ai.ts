import { useChat, useCompletion } from 'ai/react';

export function useAIChat() {
  return useChat({
    api: '/api/ai/chat',
  });
}

export function useAICompletion() {
  return useCompletion({
    api: '/api/ai/chat',
  });
}

// Custom hook for generating structured data
export function useAIGenerate() {
  const generateText = async (prompt: string) => {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, type: 'text' }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate text');
    }

    const data = await response.json();
    return data.text;
  };

  const generateObject = async (prompt: string) => {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, type: 'object' }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate object');
    }

    const data = await response.json();
    return data.object;
  };

  return { generateText, generateObject };
}