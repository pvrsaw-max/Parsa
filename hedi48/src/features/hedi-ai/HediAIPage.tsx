import { useEffect, useState } from 'react';
import { loadHediMemory, saveHediMemory } from './memory/hediMemory';
import { hediBrain } from './brain/hediBrain';

type Message = { role: 'user' | 'hedi'; text: string };

const CHAT_KEY = 'hedi-chat-history';

const welcome: Message = {
  role: 'hedi',
  text: 'سلام هدیه 🤍 من اینجام. چی توی ذهنت می‌گذره؟',
};

export default function HediAIPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(Array.isArray(parsed) && parsed.length > 0 ? parsed : [welcome]);
      } else {
        setMessages([welcome]);
      }
      loadHediMemory();
    } catch {
      setMessages([welcome]);
    }
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || isTyping) return;

    const currentMessages = Array.isArray(messages) ? messages : [welcome];
    const userMessages: Message[] = [
      ...currentMessages,
      { role: 'user', text },
    ];

    setMessages(userMessages);
    setInput('');
    setIsTyping(true);

    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(userMessages.slice(-50)));
    } catch {
      // ignore storage errors
    }

    await new Promise((resolve) => setTimeout(resolve, 350));

    const answer = hediBrain(text);
    const memory = loadHediMemory();

    saveHediMemory({
      ...memory,
      achievements: (memory.achievements || []).slice(-20),
    });

    const nextMessages: Message[] = [
      ...userMessages,
      { role: 'hedi', text: answer },
    ];

    setMessages(nextMessages);
    setIsTyping(false);

    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(nextMessages.slice(-50)));
    } catch {
      // ignore storage errors
    }
  }

  return (
    <section className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">🌷 Hedi</h2>
      <div className="rounded-xl border p-4 space-y-3 bg-white dark:bg-neutral-900">
        {messages.map((m, i) => (
          <p key={i} className={m.role === 'hedi' ? 'text-indigo-600' : ''}>
            {m.role === 'hedi' ? '🌷 هدی: ' : 'هدیه: '} {m.text}
          </p>
        ))}
        {isTyping && <p className="text-gray-500">🌷 هدی در حال فکر کردن...</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 rounded-lg border px-3 py-2 bg-transparent"
          placeholder="پیامت را بنویس..."
        />
        <button onClick={send} className="px-4 rounded-lg bg-indigo-600 text-white">ارسال</button>
      </div>
    </section>
  );
}
