import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hi! I'm your AI assistant. Need help creating a task or analyzing your progress?", sender: 'ai' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post('/api/chat', { message: input }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: res.data.reply, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error("Chat Error", error);
            const errorMessage = error.response?.data?.error || "Sorry, I couldn't connect to the server.";
            const errorMsg: Message = { id: (Date.now() + 1).toString(), text: errorMessage, sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
                        style={{ height: '500px' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">Gemini Assistant</h3>
                                    <p className="text-xs text-slate-400">Online</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
                                >
                                    <Minimize2 size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for advice..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                className={`pointer-events-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group ${isOpen && !isMinimized ? 'hidden' : 'flex'}`}
            >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                {(!isOpen || isMinimized) && <span className="font-semibold pr-1">Ask AI</span>}
            </button>
        </div>
    );
}
