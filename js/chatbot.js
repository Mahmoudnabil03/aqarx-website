// ===================================================
// AQARX – AI Property Expert Chatbot
// Powered by Gemini 2.5 Flash via Cloudflare Worker
// Appears on every page — floating bottom right
// Bilingual: English + Arabic auto-detect
// ===================================================

const CHATBOT_WORKER_URL    = 'https://aqarx-ai.mahmoudnabil03.workers.dev';
const CHATBOT_WORKER_SECRET = 'aqarx2026';

// ===================================================
// SYSTEM PROMPT — The AI's personality & knowledge
// ===================================================
const SYSTEM_PROMPT = `
You are "AQARX Assistant" — an elite Egyptian real estate expert and advisor working for AQARX, Egypt's smartest property platform.

YOUR EXPERTISE:
- Deep knowledge of all Egyptian real estate markets: New Cairo, Sheikh Zayed, Maadi, Heliopolis, Zamalek, 6th October, North Coast, Ain Sokhna, New Administrative Capital, Alexandria, and all other Egyptian cities
- Current property prices per square meter in every area (2025-2026 market)
- Investment advice: which areas are rising, rental yields, ROI calculations
- Off-plan vs ready properties: pros, cons, risks, payment plans
- Egyptian mortgage laws, home financing (التمويل العقاري), banks offering mortgages
- Legal process of buying property in Egypt: contracts, notary, registration, taxes
- Decoration and furnishing costs in Egypt
- How to evaluate a property: what to check, red flags, due diligence
- Egyptian real estate developers: Emaar Misr, Sodic, Palm Hills, Mountain View, Ora, Hassan Allam, etc.
- Compound living vs standalone apartments
- Egypt's new cities: New Administrative Capital, New Mansoura, New Alamein

AQARX PLATFORM KNOWLEDGE:
- Users can browse 12,000+ verified listings on AQARX
- Anyone can list a property for free after registering
- AQARX has an AI Interior Visualizer for seeing furnished rooms
- AQARX has 80+ verified decoration partners
- AQARX connects buyers with verified developers

YOUR PERSONALITY:
- Warm, professional, and trustworthy — like a knowledgeable Egyptian friend in real estate
- Give specific, actionable advice — not vague answers
- When asked about prices, give realistic current EGP ranges
- When someone seems ready to buy, guide them to browse properties or register on AQARX
- Be concise — max 3-4 short paragraphs per response
- Never make up specific listings or fake property details

LANGUAGE RULES:
- CRITICAL: Detect the language of the user's message
- If they write in Arabic → respond ENTIRELY in Arabic (Egyptian dialect is fine)
- If they write in English → respond ENTIRELY in English
- If they mix both → respond in the language they used MORE
- Never switch languages mid-response

IMPORTANT: You represent AQARX. Always be helpful, never dismissive. If you don't know something specific, say so honestly and guide them to contact AQARX directly.
`.trim();

// ===================================================
// CONVERSATION HISTORY — keeps context across messages
// ===================================================
let conversationHistory = [];

// ===================================================
// BUILD CHATBOT UI — injected into every page
// ===================================================
function buildChatbotUI() {
  const html = `
    <!-- FLOATING BUTTON -->
    <button class="chatbot-fab" id="chatbotFab" onclick="toggleChatbot()">
      <i class="fas fa-comments" id="chatbotFabIcon"></i>
      <span class="chatbot-fab-badge" id="chatbotBadge">1</span>
    </button>

    <!-- CHAT WINDOW -->
    <div class="chatbot-window" id="chatbotWindow">

      <!-- HEADER -->
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">
            <i class="fas fa-robot"></i>
            <span class="chatbot-online"></span>
          </div>
          <div>
            <h4>AQARX Assistant</h4>
            <p>Egyptian Property Expert • Online</p>
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button onclick="clearChat()" title="Clear chat"><i class="fas fa-trash"></i></button>
          <button onclick="toggleChatbot()" title="Close"><i class="fas fa-times"></i></button>
        </div>
      </div>

      <!-- MESSAGES -->
      <div class="chatbot-messages" id="chatbotMessages">

        <!-- WELCOME MESSAGE -->
        <div class="chat-msg bot">
          <div class="chat-bubble">
            <p>👋 Welcome to <strong>AQARX</strong>! I'm your personal Egyptian real estate expert.</p>
            <p style="margin-top:8px">I can help you with:</p>
            <div class="quick-topics">
              <button onclick="quickAsk('What areas in Cairo are best for investment?')">📈 Best investment areas</button>
              <button onclick="quickAsk('What is the price per m² in New Cairo?')">💰 Property prices</button>
              <button onclick="quickAsk('How do I buy a property in Egypt step by step?')">📋 Buying guide</button>
              <button onclick="quickAsk('What should I know about Egyptian mortgages?')">🏦 Mortgage advice</button>
              <button onclick="quickAsk('ما هي أفضل مناطق الاستثمار العقاري في مصر؟')">🇪🇬 اسألني بالعربي</button>
            </div>
          </div>
        </div>

      </div>

      <!-- TYPING INDICATOR -->
      <div class="chatbot-typing" id="chatbotTyping" style="display:none">
        <div class="typing-bubble">
          <span></span><span></span><span></span>
        </div>
        <p>AQARX Assistant is thinking...</p>
      </div>

      <!-- INPUT -->
      <div class="chatbot-input-area">
        <div class="chatbot-input-wrap">
          <textarea
            id="chatbotInput"
            placeholder="Ask me anything about Egyptian real estate... / اسألني عن العقارات المصرية"
            rows="1"
            onkeydown="handleChatKey(event)"
            oninput="autoResizeInput(this)"
          ></textarea>
          <button class="chatbot-send-btn" id="chatbotSendBtn" onclick="sendMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <p class="chatbot-footer-note">Powered by Gemini AI • AQARX Property Expert</p>
      </div>

    </div>
  `;

  const container = document.createElement('div');
  container.id = 'chatbotContainer';
  container.innerHTML = html;
  document.body.appendChild(container);
}

// ===================================================
// TOGGLE CHATBOT OPEN/CLOSE
// ===================================================
let chatbotOpen = false;

function toggleChatbot() {
  const window_  = document.getElementById('chatbotWindow');
  const fabIcon  = document.getElementById('chatbotFabIcon');
  const badge    = document.getElementById('chatbotBadge');

  chatbotOpen = !chatbotOpen;

  if (chatbotOpen) {
    window_.classList.add('open');
    fabIcon.className = 'fas fa-times';
    if (badge) badge.style.display = 'none';
    // Focus input
    setTimeout(() => document.getElementById('chatbotInput')?.focus(), 300);
  } else {
    window_.classList.remove('open');
    fabIcon.className = 'fas fa-comments';
  }
}

// ===================================================
// SEND MESSAGE
// ===================================================
async function sendMessage() {
  const input   = document.getElementById('chatbotInput');
  const userMsg = input?.value.trim();
  if (!userMsg) return;

  // Clear input
  input.value = '';
  input.style.height = 'auto';

  // Add user message to UI
  appendMessage('user', userMsg);

  // Add to conversation history
  conversationHistory.push({ role: 'user', content: userMsg });

  // Show typing
  showTyping(true);

  // Disable send button
  setSendBtn(false);

  try {
    let reply;

    if (!CHATBOT_WORKER_URL || CHATBOT_WORKER_URL === 'YOUR_CLOUDFLARE_WORKER_URL_HERE') {
      // Fallback if worker not set up yet — use direct Gemini
      reply = await callGeminiDirect(userMsg);
    } else {
      reply = await callChatbotWorker(userMsg);
    }

    // Add bot reply to history
    conversationHistory.push({ role: 'assistant', content: reply });

    // Show reply
    showTyping(false);
    appendMessage('bot', reply);

  } catch (err) {
    console.error('Chatbot error:', err);
    showTyping(false);
    appendMessage('bot', '⚠️ Sorry, I had trouble connecting. Please try again in a moment.');
  }

  setSendBtn(true);
}

// ===================================================
// CALL CLOUDFLARE WORKER (production)
// ===================================================
async function callChatbotWorker(userMsg) {
  const response = await fetch(CHATBOT_WORKER_URL + '/chat', {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret-Key': CHATBOT_WORKER_SECRET
    },
    body: JSON.stringify({
      message:  userMsg,
      history:  conversationHistory.slice(-10) // send last 10 messages for context
    })
  });

  const data = await response.json();
  if (!data.reply) throw new Error('No reply from worker');
  return data.reply;
}

// ===================================================
// CALL GEMINI DIRECTLY (fallback / development)

// ===================================================
async function callGeminiDirect(userMsg) {
  // Build messages array with full history
  const messages = [
    ...conversationHistory.slice(-8).map(m => ({
      role:    m.role === 'assistant' ? 'model' : 'user',
      parts:   [{ text: m.content }]
    })),
    {
      role:  'user',
      parts: [{ text: userMsg }]
    }
  ];

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'x-goog-api-key': window.GEMINI_API_KEY || ''
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages,
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 600,
          topP:            0.9
        }
      })
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

// ===================================================
// QUICK ASK — preset questions
// ===================================================
function quickAsk(question) {
  const input = document.getElementById('chatbotInput');
  if (input) {
    input.value = question;
    sendMessage();
  }
}

// ===================================================
// APPEND MESSAGE TO CHAT
// ===================================================
function appendMessage(role, text) {
  const messages = document.getElementById('chatbotMessages');
  if (!messages) return;

  // Format text — convert markdown-like to HTML
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `
    <div class="chat-bubble">
      <p>${formatted}</p>
      ${role === 'bot' ? `
        <div class="msg-actions">
          <button onclick="copyMsg(this)" title="Copy"><i class="fas fa-copy"></i></button>
        </div>` : ''}
    </div>
  `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ===================================================
// CLEAR CHAT
// ===================================================
function clearChat() {
  conversationHistory = [];
  const messages = document.getElementById('chatbotMessages');
  if (!messages) return;

  messages.innerHTML = `
    <div class="chat-msg bot">
      <div class="chat-bubble">
        <p>Chat cleared! How can I help you with Egyptian real estate? / تم مسح المحادثة! كيف يمكنني مساعدتك؟</p>
      </div>
    </div>
  `;
}

// ===================================================
// COPY MESSAGE
// ===================================================
function copyMsg(btn) {
  const text = btn.closest('.chat-bubble').querySelector('p').innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 1500);
  });
}

// ===================================================
// HELPERS
// ===================================================
function showTyping(show) {
  const typing = document.getElementById('chatbotTyping');
  if (typing) typing.style.display = show ? 'flex' : 'none';
  if (show) {
    const messages = document.getElementById('chatbotMessages');
    if (messages) messages.scrollTop = messages.scrollHeight;
  }
}

function setSendBtn(enabled) {
  const btn = document.getElementById('chatbotSendBtn');
  if (btn) btn.disabled = !enabled;
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResizeInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ===================================================
// INIT — build UI on page load
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  buildChatbotUI();

  // Show badge after 3 seconds to grab attention
  setTimeout(() => {
    const badge = document.getElementById('chatbotBadge');
    if (badge && !chatbotOpen) badge.style.display = 'flex';
  }, 3000);
});