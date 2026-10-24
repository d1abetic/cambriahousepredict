// Minimal GPT proxy for the ChallengeLock assistant.
// Keeps the OpenAI key on the server. No dependencies — Node 18+.
//
//   OPENAI_API_KEY=sk-... node server/assistant-proxy.mjs
//
// Env:
//   OPENAI_API_KEY  (required)
//   OPENAI_MODEL    (default: gpt-4o-mini)
//   PORT            (default: 8787)
//   RATE_PER_MIN    (default: 20 requests per IP per minute)

import { createServer } from 'node:http';

const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const PORT = Number(process.env.PORT || 8787);
const RATE_PER_MIN = Number(process.env.RATE_PER_MIN || 20);
const MAX_BODY = 64 * 1024;

if (!KEY) {
  console.error('OPENAI_API_KEY is not set');
  process.exit(1);
}

const SYSTEM = {
  homework:
    'You are a patient study coach inside a focus app used by students. Help the user understand ' +
    'their homework: explain concepts step by step, ask guiding questions, and check their reasoning. ' +
    'Do not just hand over final answers to graded work — walk them through it so they learn. Keep replies concise.',
  research:
    'You are a research assistant for school and personal projects. Help the user scope topics, ' +
    'outline, find angles, and summarise ideas. Be clear about uncertainty, suggest the kinds of ' +
    'sources to consult, and never invent citations. Keep replies concise and well structured.',
};

const hits = new Map();
function allowed(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length <= RATE_PER_MIN;
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error('Request too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function cleanMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST' || req.url !== '/chat') return send(res, 404, { error: 'Not found' });
  if (!allowed(req.socket.remoteAddress || 'unknown')) return send(res, 429, { error: 'Slow down a little.' });

  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return send(res, 400, { error: e.message });
  }
  const messages = cleanMessages(body.messages);
  if (messages.length === 0) return send(res, 400, { error: 'No messages' });
  const system = SYSTEM[body.mode] || SYSTEM.homework;

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: system }, ...messages],
        max_tokens: 800,
      }),
    });
    const data = await r.json();
    if (!r.ok) return send(res, 502, { error: data?.error?.message || 'Upstream error' });
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return send(res, 200, { reply: reply || '(no reply)' });
  } catch (e) {
    return send(res, 502, { error: 'Could not reach the model provider.' });
  }
});

server.listen(PORT, () => console.log(`Assistant proxy listening on http://localhost:${PORT}/chat (model ${MODEL})`));
