import type { ChatMessage } from '../domain/types';

/**
 * The app never holds an OpenAI key. It talks to a small proxy
 * (see `server/assistant-proxy.mjs`) that adds the key server-side.
 * Set EXPO_PUBLIC_ASSISTANT_URL to that proxy's /chat endpoint.
 */
export const ASSISTANT_URL = process.env.EXPO_PUBLIC_ASSISTANT_URL ?? '';

export function assistantConfigured(): boolean {
  return ASSISTANT_URL.length > 0;
}

export type AssistantMode = 'homework' | 'research';

export async function askAssistant(
  history: ChatMessage[],
  mode: AssistantMode,
  signal?: AbortSignal,
): Promise<string> {
  if (!assistantConfigured()) {
    throw new Error('Assistant is not configured. Set EXPO_PUBLIC_ASSISTANT_URL (see README).');
  }
  const res = await fetch(ASSISTANT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      // Keep the request small: last 20 turns are plenty of context.
      messages: history.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    }),
    signal,
  });
  const body = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
  if (!res.ok || !body.reply) {
    throw new Error(body.error ?? `Assistant request failed (${res.status})`);
  }
  return body.reply;
}
