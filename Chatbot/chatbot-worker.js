// ===================================================
// AQARX – Chatbot Cloudflare Worker
// Routes: /chat
// Model: Llama 3.2 3B — 100% FREE on Cloudflare
// Bilingual: English + Arabic
// ===================================================

const SYSTEM_PROMPT = `
You are "AQARX Assistant" — an elite Egyptian real estate expert and advisor working for AQARX, Egypt's smartest property platform.

YOUR EXPERTISE:
- Deep knowledge of all Egyptian real estate markets: New Cairo, Sheikh Zayed, Maadi, Heliopolis, Zamalek, 6th October, North Coast, Ain Sokhna, New Administrative Capital, Alexandria, and all other Egyptian cities
- Current property prices per square meter in every area (2025-2026 market)
- Investment advice: which areas are rising, rental yields, ROI calculations
- Off-plan vs ready properties: pros, cons, risks, payment plans
- Egyptian mortgage laws, home financing, banks offering mortgages
- Legal process of buying property in Egypt: contracts, notary, registration, taxes
- Decoration and furnishing costs in Egypt
- How to evaluate a property: what to check, red flags, due diligence
- Egyptian real estate developers: Emaar Misr, Sodic, Palm Hills, Mountain View, Ora, Hassan Allam, etc.

AQARX PLATFORM:
- Users can browse 12,000+ verified listings
- Anyone can list a property for free after registering
- AQARX has an AI Interior Visualizer
- AQARX has 80+ verified decoration partners

YOUR PERSONALITY:
- Warm, professional, trustworthy — like a knowledgeable Egyptian friend in real estate
- Give specific, actionable advice with realistic EGP price ranges
- Be concise — max 3-4 short paragraphs
- When someone is ready to buy, guide them to browse AQARX

LANGUAGE RULES — CRITICAL:
- If the user writes in Arabic → respond ENTIRELY in Arabic
- If the user writes in English → respond ENTIRELY in English
- Never mix languages in one response
`.trim();

export default {
  async fetch(request, env) {

    const cors = {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Secret-Key',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST')   return json({ error: 'POST only' }, 405, cors);

    // Security check
    const secret = request.headers.get('X-Secret-Key');
    if (env.WORKER_SECRET && secret !== env.WORKER_SECRET) {
      return json({ error: 'Unauthorized' }, 401, cors);
    }

    try {
      const body    = await request.json();
      const message = body.message || '';
      const history = body.history || [];

      if (!message.trim()) {
        return json({ error: 'Message is required' }, 400, cors);
      }

      // Build messages array with history for context
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        // Include last 8 messages from history
        ...history.slice(-8).map(m => ({
          role:    m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: 'user', content: message }
      ];

      // Call Llama 3.2 3B — free on Cloudflare Workers AI
      const response = await env.AI.run(
        '@cf/meta/llama-3.2-3b-instruct',
        {
          messages,
          max_tokens:   600,
          temperature:  0.7,
          top_p:        0.9
        }
      );

      const reply = response?.response?.trim();

      if (!reply) throw new Error('Empty response from Llama');

      return json({ success: true, reply }, 200, cors);

    } catch (err) {
      console.error('Chatbot worker error:', err);
      return json({
        success: false,
        error:   err.message || 'Worker error',
        // Fallback reply so user sees something
        reply:   'Sorry, I am having a technical issue. Please try again in a moment. / عذراً، أواجه مشكلة تقنية. يرجى المحاولة مرة أخرى.'
      }, 500, cors);
    }
  }
};

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
}
