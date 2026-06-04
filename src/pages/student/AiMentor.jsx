import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Paperclip } from 'lucide-react';

export default function AiMentor() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Привіт! Я ваш ШІ-ментор для C#. З чим вам сьогодні допомогти? Якщо у вас є помилка в коді, просто вставте її сюди.' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');

    // Simulate AI typing and response
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'Звучить як проблема з Reference/Value типами. Коли ви передаєте клас у метод, ви передаєте посилання (Reference). Коли передаєте структуру (struct) — передається копія значення (Value). Тому зміни в структурі всередині методу не впливають на оригінал!' 
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bot color="var(--accent)" />
        ШІ-Ментор
      </h2>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Chat History */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', gap: '1rem', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(247, 37, 133, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.sender === 'bot' ? 'var(--accent)' : 'white', flexShrink: 0 }}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={{ background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px', borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '12px', maxWidth: '75%', lineHeight: '1.5' }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <button className="btn btn-secondary" style={{ padding: '0.8rem', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
            <Paperclip size={20} />
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Опишіть проблему або вставте код помилки..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.8rem 1rem', color: 'var(--text-primary)', resize: 'none', outline: 'none', minHeight: '50px', maxHeight: '150px' }}
          />
          <button className="btn btn-primary" onClick={handleSend} style={{ padding: '0.8rem 1.2rem', borderRadius: '8px' }}>
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
