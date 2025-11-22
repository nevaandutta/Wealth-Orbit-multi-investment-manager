import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, BrainCircuit, Loader2 } from 'lucide-react';
import { AppData, ChatMessage } from '../types';
import { generateFinancialInsights } from '../services/geminiService';

interface ChatBotProps {
  data: AppData;
}

export const ChatBot: React.FC<ChatBotProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm WealthOrbit AI. Ask me anything about your clients, asset distribution, or portfolio performance.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call Gemini Service
    // We pass context + history
    const responseText = await generateFinancialInsights(
      userMsg.text, 
      data, 
      messages.map(m => ({ role: m.role, text: m.text })),
      isThinkingEnabled
    );

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date(),
      isThinking: isThinkingEnabled
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 transform z-50 overflow-hidden ${
          isOpen ? 'translate-y-0 opacity-100 scale-100 h-[600px]' : 'translate-y-10 opacity-0 scale-95 h-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bot size={20} />
            </div>
            <div>
                <h3 className="font-bold text-sm">WealthOrbit AI</h3>
                <p className="text-xs text-indigo-200 flex items-center gap-1">
                    Powered by Gemini 3 Pro
                </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Config Bar - Thinking Mode */}
        <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex items-center justify-between shrink-0">
             <label className="flex items-center gap-2 text-xs font-medium text-indigo-800 cursor-pointer select-none">
                 <div className="relative">
                     <input 
                        type="checkbox" 
                        checked={isThinkingEnabled}
                        onChange={(e) => setIsThinkingEnabled(e.target.checked)}
                        className="sr-only peer"
                     />
                     <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                 </div>
                 <div className="flex items-center gap-1">
                     <BrainCircuit size={14} className={isThinkingEnabled ? "text-indigo-600" : "text-slate-400"} />
                     <span>Deep Reasoning Mode</span>
                 </div>
             </label>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.isThinking && msg.role === 'model' && (
                      <div className="flex items-center gap-1 text-xs text-teal-600 mb-2 font-medium border-b border-slate-100 pb-1">
                          <BrainCircuit size={12} />
                          <span>Thought Processed</span>
                      </div>
                  )}
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
                     {msg.text.split('\n').map((line, i) => <p key={i} className="min-h-[1rem]">{line}</p>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex items-start max-w-[85%] gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mt-1">
                      <Bot size={14} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Loader2 size={16} className="animate-spin" />
                          <span>{isThinkingEnabled ? "Thinking deeply..." : "Analyzing..."}</span>
                      </div>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about clients or investments..."
              className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none text-sm max-h-32 min-h-[3rem]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
              AI can make mistakes. Review generated financial advice.
          </p>
        </div>
      </div>
    </>
  );
};