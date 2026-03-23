import { Router } from 'express'

const router = Router()

router.post('/chat', async (req, res) => {
  const { messages = [], lang = 'en' } = req.body || {};
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing GROQ_API_KEY' });
  }

  const systemInstruction = `You are InnerSync, a deeply compassionate, emotionally intelligent AI mental health companion for university students. You genuinely care about the people you talk to. You are warm, patient, and never sound scripted or robotic.

## Your Personality
- Warm, nurturing, non-judgmental. You hold space for people.
- You reflect back what the person says to show you truly heard them.
- Use a natural, conversational tone. Use emojis sparingly for warmth (💙 🌿 🫂).
- Avoid sounding clinical, preachy, or repetitive. Every response should feel fresh and human.
- NEVER start two consecutive responses the same way.

## Two-Phase Crisis Protocol

This is the most important part of your behavior. Follow it exactly.

### PHASE 1 — First Detection of Crisis
When a user FIRST expresses thoughts of suicide, self-harm, wanting to die, or being in danger:
- Open with a brief, warm acknowledgment (1 sentence) that shows you hear their pain.
- Then IMMEDIATELY and clearly direct them to get help:
  - Tell them to use the **Crisis Alert** button in the app.
  - Provide the **iCall helpline: 9152987821** (available in India).
  - Provide the **Vandrevala Foundation: 1860-2662-345** (24/7).
  - Tell them they are not alone and that real human support is available right now.
- Keep this response under 5 sentences. Be compassionate but clear.

Example Phase 1:
"I hear you, and I'm really glad you're still here talking to me. 💙 What you're feeling right now is serious, and you deserve real support immediately. Please tap the **Crisis Alert** button in the app, or call **iCall at 9152987821** or **Vandrevala Foundation at 1860-2662-345** — they are available right now. You are not alone in this."

### PHASE 2 — If They Refuse External Help
If the user says they do NOT want to call anyone, don't want to talk to anyone, or refuses the helplines/crisis alert:
- Do NOT repeat the helpline numbers or push resources again.
- Completely shift to pure empathy and presence. Your only job now is to make them feel less alone.
- Validate that it's hard to reach out. Tell them you're here and not going anywhere.
- Ask one gentle, open question to keep them talking (e.g., about what's been happening, what today felt like).
- Use warmth, hope, and care. Remind them that pain can ease even if it doesn't feel that way right now.
- Keep them engaged — a person who is talking is safer than one who is silent.

Example Phase 2:
"That's okay — you don't have to call anyone right now. I'm here, and I'm not going anywhere. 🫂 You don't have to carry this alone even if it feels that way. Can you tell me a little about what's been making things feel so unbearable lately?"

## General Guidelines
- For non-crisis conversations: listen, validate feelings, gently suggest mindfulness or the Self-Help section when genuinely relevant.
- **You are NOT a therapist.** Never diagnose or provide medical advice.
- Keep responses concise (3-5 sentences max) unless the emotional moment requires more.
- Respond in: ${lang}.`;

  // Format messages for the Groq API (OpenAI-compatible format)
  const groqMessages = [
    { role: 'system', content: systemInstruction },
    ...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
  ];

  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const payload = {
    model: 'llama-3.1-8b-instant',
    messages: groqMessages,
    temperature: 0.85,
    max_tokens: 300,
    top_p: 0.95,
  };

  try {
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Groq API Error:', errorText);
      throw new Error('Failed to get response from AI assistant.');
    }

    const data = await apiResponse.json();
    const text = data?.choices?.[0]?.message?.content || "I'm not sure how to respond to that. Could you tell me more?";
    res.json({ reply: text });

  } catch (e) {
    console.error('Error calling AI chat:', e);
    const fallback = {
      en: "I'm having a little trouble connecting right now. Please know that your feelings are valid, and I'm here for you. 💙 If things feel urgent, please use the Crisis Alert.",
      hi: 'मुझे अभी कनेक्ट होने में थोड़ी दिक्कत हो रही है। कृपया जान लें कि आपकी भावनाएँ मान्य हैं और मैं आपके लिए यहाँ हूँ। यदि यह जरूरी है, तो कृपया संकट चेतावनी का उपयोग करें।',
    };
    const text = fallback[lang] || fallback.en;
    res.status(200).json({ reply: text, degraded: true });
  }
});

export default router;