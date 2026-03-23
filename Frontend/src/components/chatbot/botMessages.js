export const BOT_MESSAGES = {
  en: {
    hello: "Hi! I'm your InnerSync assistant. How can I help?",
    placeholder: "Type a message...",
    nudge: "Have a question or just want to talk? I'm here!",
    crisis: "If you feel unsafe, tap Crisis Alert or call your local helpline.",
    help: "You can choose Self Help, Peer Support, or Counselor from Support.",
    breathe: "Try a 5-minute breathing exercise in Self Help → Meditation.",
    default: "Thanks for sharing. I'm listening.",
  },
  hi: {
    hello: "नमस्ते! मैं InnerSync सहायक हूँ। मैं आपकी कैसे मदद कर सकता/सकती हूँ?",
    placeholder: "यहाँ लिखें...",
    nudge: "कोई सवाल है या बस बात करना चाहते हैं? मैं यहाँ हूँ!",
    crisis: "यदि आप असुरक्षित महसूस कर रहे हैं, तो Crisis Alert दबाएँ।",
    help: "आप Self Help, Peer Support, या Counselor चुन सकते हैं।",
    breathe: "Self Help → Meditation में 5 मिनट का श्वास व्यायाम आज़माएँ।",
    default: "धन्यवाद, मैं आपकी बात समझ रहा/रही हूँ।",
  },
  ta: {
    hello: "வணக்கம்! நான் உங்கள் InnerSync உதவியாளர். நான் எப்படி உதவ முடியும்?",
    placeholder: "ஒரு செய்தியை தட்டச்சு செய்யவும்...",
    nudge: "கேள்வி இருக்கிறதா அல்லது பேச விரும்புகிறீர்களா? நான் இங்கே இருக்கிறேன்!",
    default: "பகிர்ந்தமைக்கு நன்றி. நான் கேட்டுக்கொண்டிருக்கிறேன்.",
  },
  te: {
    hello: "నమస్కారం! నేను మీ InnerSync సహాయకుడిని. నేను ఎలా సహాయపడగలను?",
    placeholder: "సందేశాన్ని టైప్ చేయండి...",
    nudge: "ప్రశ్న ఉందా లేదా కేవలం మాట్లాడాలనుకుంటున్నారా? నేను ఇక్కడ ఉన్నాను!",
    default: "పంచుకున్నందుకు ధನ್ಯవాదాలు. నేను వింటున్నాను.",
  },
  bn: {
    hello: "নমস্কার! আমি আপনার InnerSync সহকারী। আমি কিভাবে সাহায্য করতে পারি?",
    placeholder: "একটি বার্তা টাইপ করুন...",
    nudge: "কোন প্রশ্ন আছে বা শুধু কথা বলতে চান? আমি এখানে আছি!",
    default: "শেয়ার করার জন্য ধন্যবাদ। আমি শুনছি।",
  },
};

const INTENTS = [
  { key: 'crisis', patterns: [/suicid|hurt|unsafe|danger/i, /आत्महत्या|खतरा|அபாய/i, /ప్రమాదం|ఆత్మహత్య/i, /আত্মহত্যা|বিপদ/i] },
  { key: 'help', patterns: [/help|support|assist/i, /मदद|सहायता/i, /உதவி/i, /సహాయం/i, /সাহায্য/i] },
  { key: 'breathe', patterns: [/anx|anxiety|panic|breathe/i, /घबराहट|सांस/i, /பதட்டம்|மூச்சு/i, /ఆందోళన|ఊపిరి/i, /উদ্বেগ|শ্বাস/i] },
];

export function detectLanguage(text) {
  // Very naive detection for demo
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
  if (/[अ-ह]/.test(text)) return 'hi'; // Hindi
  return 'en'; // Default to English
}

export function replyFor(text, lang = 'en') {
  const pack = BOT_MESSAGES[lang] || BOT_MESSAGES.en;
  if (!text.trim()) return pack.default;
  for (const intent of INTENTS) {
    if (intent.patterns.some(p => p.test(text))) return pack[intent.key] || pack.default;
  }
  return pack.default;
}