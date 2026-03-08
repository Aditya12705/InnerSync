import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import styles from './ChatbotWidget.module.scss';
import { BOT_MESSAGES, detectLanguage } from './botMessages.js';
import { AIAPI } from '../../services/api.js';

export function ChatbotWidget() {
  // ... rest of state and effects (remained same)
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: BOT_MESSAGES['en'].hello }
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user's message to the state immediately
    const userMessage = { id: Date.now(), from: 'you', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Prepare history for the API
    const history = [...messages, userMessage].map(m => ({
      role: m.from === 'you' ? 'user' : 'assistant',
      content: m.text
    })).slice(1); // Remove the initial greeting from history

    try {
      const detected = detectLanguage(text) || lang;
      setLang(detected);

      // Call the API with conversation history
      const ai = await AIAPI.chat({ messages: history, lang: detected });

      // Add the AI's response
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: ai.reply }]);

    } catch (err) {
      console.error("Chatbot API error:", err);
      const fallbackMessage = "I'm having a little trouble connecting right now. Please try again in a moment.";
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: fallbackMessage }]);
    }
  }

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    setMessages([{ id: 1, from: 'bot', text: BOT_MESSAGES[newLang].hello }]);
  };

  return (
    <div className={styles.root}>
      {!open && (
        <div className={styles.nudge} onClick={() => setOpen(true)}>
          <div className={styles.nudgeIcon}><MessageCircle size={18} /></div>
          <span>{BOT_MESSAGES[lang].nudge}</span>
        </div>
      )}

      <div className={styles.widgetContainer}>
        {open && (
          <div className={styles.panel}>
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <img src="/images/logo.png" alt="Logo" className={styles.logo} />
                <span className={styles.title}>AI Assistant</span>
              </div>
              <select value={lang} onChange={handleLangChange} className={styles.langSelect}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
            <div className={styles.list} ref={listRef}>
              {messages.map(m => (
                <div key={m.id} className={`${styles.msg} ${m.from === 'you' ? styles.you : styles.bot}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form className={styles.inputRow} onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={BOT_MESSAGES[lang].placeholder}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              />
              <button type="submit" className="btn primary">Send</button>
            </form>
          </div>
        )}
        <button className={styles.fab} onClick={() => setOpen(v => !v)} aria-label="Toggle Chatbot">
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </div>
  );
}