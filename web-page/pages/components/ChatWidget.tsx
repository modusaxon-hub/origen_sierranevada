import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendChatMessage } from '../services/geminiService';
import { Message } from '../types';

const ChatWidget: React.FC = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // Initialize welcome message once
    useEffect(() => {
        if (!hasInitialized.current) {
            setMessages([{
                id: 'init', 
                role: 'model', 
                content: language === 'es' 
                    ? '¡Hola! Soy tu Barista Virtual. ☕ ¿Tienes preguntas sobre nuestros granos o cómo prepararlos?' 
                    : 'Hello! I am your Virtual Barista. ☕ Do you have questions about our beans or brewing methods?', 
                timestamp: new Date() 
            }]);
            hasInitialized.current = true;
        }
    }, [language]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { 
            id: Date.now().toString(), 
            role: 'user', 
            content: input, 
            timestamp: new Date() 
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare context history for API
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));

            const responseText = await sendChatMessage(history, userMsg.content, language);
            
            const modelMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                content: responseText, 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                content: language === 'es' ? "Lo siento, tuve un problema de conexión. Intenta de nuevo." : "Sorry, I had a connection issue. Please try again.", 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div className={`pointer-events-auto bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl w-[320px] sm:w-[380px] mb-4 transition-all duration-300 origin-bottom-right overflow-hidden flex flex-col ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-95 translate-y-10 h-0'}`}>
                
                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center text-white shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                            <span className="material-icons-outlined text-lg">smart_toy</span>
                        </div>
                        <div>
                            <span className="font-display font-bold block text-sm tracking-wide">{t('chat.title', 'Barista IA')}</span>
                            <span className="text-[10px] opacity-90 block flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> 
                                Online
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1.5 transition-colors">
                        <span className="material-icons-outlined text-sm">close</span>
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-light dark:bg-background-dark scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white dark:bg-surface-light/5 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-white dark:bg-surface-light/5 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-bl-none flex gap-1.5 items-center shadow-sm">
                                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
                    <div className="flex gap-2 relative">
                        <input 
                            className="flex-1 bg-gray-100 dark:bg-black/20 border-none rounded-full pl-5 pr-12 py-3 text-sm focus:ring-1 focus:ring-primary dark:text-white placeholder-gray-500"
                            placeholder={t('chat.placeholder', 'Ask about coffee...')}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1 top-1 bottom-1 aspect-square bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors shadow-md"
                        >
                            <span className="material-icons-outlined text-lg">send</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 group ${isOpen ? 'bg-surface-dark dark:bg-gray-700 text-white' : 'bg-primary text-white hover:bg-primary-hover'}`}
            >
                <span className={`material-icons-outlined text-3xl transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:-rotate-12'}`}>
                    {isOpen ? 'close' : 'chat'}
                </span>
                
                {/* Notification Dot if closed (optional logic could go here) */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark animate-pulse"></span>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;