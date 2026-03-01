import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, analyzeImage, generateImage, editImage, generateVideo } from '../services/geminiService';
import { Message, GenerationState, VideoGenerationState } from '../types';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

// Define the tabs for the AI Lab
type AiTab = 'chat' | 'analyze' | 'generate' | 'edit' | 'video';

const AiLabPage: React.FC = () => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<AiTab>('chat');

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block p-3 rounded-full border border-primary/30 bg-primary/5 mb-4">
                        <span className="material-icons-outlined text-primary text-3xl">science</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-gray-900 dark:text-white mb-4">{t('ai.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('ai.desc')}
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { id: 'chat', label: t('ai.tab.chat'), icon: 'chat' },
                        { id: 'analyze', label: t('ai.tab.analyze'), icon: 'image_search' },
                        { id: 'generate', label: t('ai.tab.generate'), icon: 'palette' },
                        { id: 'edit', label: t('ai.tab.edit'), icon: 'auto_fix_high' },
                        { id: 'video', label: t('ai.tab.video'), icon: 'movie' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as AiTab)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 font-accent text-xs font-bold tracking-widest uppercase ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                                    : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary'
                            }`}
                        >
                            <span className="material-icons-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden min-h-[600px] relative">
                    <div className="p-8 h-full">
                        {activeTab === 'chat' && <ChatModule />}
                        {activeTab === 'analyze' && <AnalyzeModule />}
                        {activeTab === 'generate' && <GenerateImageModule />}
                        {activeTab === 'edit' && <EditImageModule />}
                        {activeTab === 'video' && <VideoModule />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

/* --- Sub-Modules --- */

// 1. Chat Module
const ChatModule = () => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', content: language === 'es' ? 'Bienvenido a Origen Sierra Nevada. Soy tu Barista IA. ¿En qué puedo ayudarte hoy?' : 'Welcome to Origen Sierra Nevada. I am your AI Barista. How can I help you perfect your brew today?', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));
            
            const responseText = await sendChatMessage(history, userMsg.content, language);
            const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: new Date() };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: language === 'es' ? "Error al conectar con los servidores de origen. Intenta de nuevo." : "I'm having trouble connecting to the origin servers. Please try again.", timestamp: new Date() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-gray-100 dark:bg-background-dark text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
                        }`}>
                            <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                            <span className="text-[10px] opacity-70 mt-2 block">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-background-dark p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                             <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                             <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-6 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('ai.input_placeholder')} 
                    className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-full px-6 py-3 focus:outline-none focus:border-primary text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
                >
                    <span className="material-icons-outlined">send</span>
                </button>
            </div>
        </div>
    );
};

// 2. Analyze Module
const AnalyzeModule = () => {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setAnalysis(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const text = await analyzeImage(file, "As an expert coffee roaster, analyze this image. If it's beans, describe roast level and quality. If it's a brew, judge the extraction. If unrelated, say so politely.");
            setAnalysis(text);
        } catch (e) {
            setAnalysis("Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-black/20 group hover:border-primary/50 transition-colors">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-contain" alt="Upload preview" />
                    ) : (
                        <div className="text-center p-6">
                            <span className="material-icons-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                            <p className="text-sm text-gray-500">{t('ai.upload_placeholder')}</p>
                        </div>
                    )}
                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <button 
                    onClick={handleAnalyze} 
                    disabled={!file || loading}
                    className="bg-primary text-white py-4 rounded-lg font-bold font-accent tracking-widest uppercase hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {loading && <span className="material-icons-outlined animate-spin">refresh</span>}
                    {loading ? t('common.loading') : t('ai.analyze_btn')}
                </button>
            </div>
            <div className="bg-gray-100 dark:bg-background-dark rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
                <h3 className="font-display text-xl text-gray-900 dark:text-white mb-4 border-b border-primary/20 pb-2">{t('ai.notes_title')}</h3>
                {analysis ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{analysis}</p>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                        <span className="material-icons-outlined text-4xl mb-2">description</span>
                        <p className="text-sm">{t('ai.notes_placeholder')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// 3. Generate Image Module
const GenerateImageModule = () => {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Check key for pro model usage
    const handleGenerate = async () => {
        if (!prompt) return;
        
        // Check for key for pro model features if not available in env
        // We only trigger selection if there is NO env key and the user hasn't selected one.
        // @ts-ignore
        if (!process.env.API_KEY && window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
             // @ts-ignore
             await window.aistudio.openSelectKey();
        }

        setLoading(true);
        try {
            const imgData = await generateImage(prompt, size);
            setResult(imgData);
        } catch (e) {
            console.error(e);
            alert("Generation failed. Please ensure API Key is valid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6">
                 <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('ai.prompt_label')}</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-4 focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 dark:text-white h-32 resize-none"
                        placeholder="E.g., A minimalist coffee bag label featuring a golden mountain peak..."
                    />
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('ai.res_label')}</label>
                    <div className="flex gap-4">
                        {['1K', '2K', '4K'].map((s) => (
                            <button 
                                key={s}
                                onClick={() => setSize(s as any)}
                                className={`flex-1 py-3 border rounded font-display ${size === s ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-700 text-gray-500'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                 </div>

                <button 
                    onClick={handleGenerate} 
                    disabled={!prompt || loading}
                    className="bg-primary text-white py-4 rounded-lg font-bold font-accent tracking-widest uppercase hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-auto"
                >
                    {loading ? <span className="material-icons-outlined animate-spin">refresh</span> : <span className="material-icons-outlined">draw</span>}
                    {loading ? 'Designing...' : t('ai.generate_btn')}
                </button>
            </div>

            <div className="bg-gray-100 dark:bg-black/40 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-800 relative overflow-hidden min-h-[300px]">
                {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
                         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                         <span className="font-accent tracking-widest text-xs animate-pulse">Creating Masterpiece...</span>
                    </div>
                )}
                {result ? (
                    <img src={result} alt="Generated" className="w-full h-full object-contain" />
                ) : (
                    <div className="text-center text-gray-400 opacity-50">
                        <span className="material-icons-outlined text-6xl mb-4">image</span>
                        <p className="font-display">Your design will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// 4. Edit Image Module
const EditImageModule = () => {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setResult(null);
        }
    };

    const handleEdit = async () => {
        if (!file || !prompt) return;
        setLoading(true);
        try {
            const editedImage = await editImage(file, prompt);
            setResult(editedImage);
        } catch (e) {
            console.error(e);
            alert("Edit failed. Please try a different image or prompt.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
             <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('ai.prompt_label')}</label>
                    <input 
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Add a retro filter, remove background..."
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-gray-900 dark:text-white"
                    />
                </div>
                 <button 
                    onClick={handleEdit} 
                    disabled={!file || !prompt || loading}
                    className="bg-primary text-white py-3 px-8 rounded-lg font-bold font-accent tracking-widest uppercase hover:bg-primary-hover disabled:opacity-50 transition-all h-[50px]"
                >
                    {loading ? 'Processing...' : t('ai.edit_btn')}
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Source */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-black/20 group hover:border-primary/50 transition-colors">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-contain" alt="Original" />
                    ) : (
                         <div className="text-center p-6">
                            <span className="material-icons-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
                            <p className="text-sm text-gray-500">Upload Source Image</p>
                        </div>
                    )}
                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                {/* Result */}
                <div className="bg-gray-100 dark:bg-black/40 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                        </div>
                    )}
                    {result ? (
                         <img src={result} className="w-full h-full object-contain" alt="Edited" />
                    ) : (
                        <div className="text-center text-gray-400 opacity-50">
                            <span className="material-icons-outlined text-4xl mb-2">auto_fix_normal</span>
                            <p className="font-display">Edited result</p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

// 5. Video Module (Veo)
const VideoModule = () => {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [aspect, setAspect] = useState<'16:9' | '9:16'>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<VideoGenerationState>({ videoUri: null, isLoading: false, statusMessage: '', error: null });
    const [needsKey, setNeedsKey] = useState(false);

    // Initial check for key
    useEffect(() => {
        const checkKey = async () => {
            // @ts-ignore
            if (process.env.API_KEY) return; // Valid env key exists, no need to ask user
            
            // @ts-ignore
            if (window.aistudio) {
                // @ts-ignore
                const hasKey = await window.aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    setNeedsKey(true);
                }
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        // @ts-ignore
        if (window.aistudio) {
             // @ts-ignore
             await window.aistudio.openSelectKey();
             setNeedsKey(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        
        setStatus({ isLoading: true, statusMessage: 'Initializing Veo Engine...', error: null, videoUri: null });
        
        try {
            const url = await generateVideo(prompt, aspect, file || undefined);
            setVideoUrl(url);
            setStatus({ isLoading: false, statusMessage: 'Complete!', error: null, videoUri: url });
        } catch (e: any) {
            console.error(e);
            if (e.message === "API_KEY_REQUIRED") {
                setNeedsKey(true);
                setStatus({ isLoading: false, statusMessage: '', error: null, videoUri: null });
            } else {
                 setStatus({ isLoading: false, statusMessage: '', error: 'Generation failed. This feature takes time and requires quota.', videoUri: null });
            }
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {needsKey && (
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-4 rounded-lg flex justify-between items-center border border-amber-200 dark:border-amber-800">
                    <span className="text-sm">Veo requires a paid API key selection.</span>
                    <div className="flex items-center gap-4">
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-xs">Billing Docs</a>
                        <button onClick={handleSelectKey} className="bg-amber-600 text-white px-4 py-2 rounded text-xs font-bold uppercase">Select Key</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                {/* Controls */}
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('ai.prompt_label')}</label>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-4 focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 dark:text-white h-24 resize-none"
                            placeholder="A cinematic slow motion shot of coffee pouring..."
                        />
                    </div>

                     <div className="flex gap-4">
                        <div className="flex-1">
                             <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Aspect Ratio</label>
                             <div className="flex border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
                                 <button onClick={() => setAspect('16:9')} className={`flex-1 py-2 text-xs ${aspect === '16:9' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>16:9</button>
                                 <button onClick={() => setAspect('9:16')} className={`flex-1 py-2 text-xs ${aspect === '9:16' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>9:16</button>
                             </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Reference Image (Optional)</label>
                            <input 
                                type="file" 
                                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                                className="block w-full text-xs text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-xs file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20"
                            />
                        </div>
                     </div>

                     <button 
                        onClick={handleGenerate} 
                        disabled={!prompt || status.isLoading || needsKey}
                        className="mt-auto bg-primary text-white py-4 rounded-lg font-bold font-accent tracking-widest uppercase hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {status.isLoading ? 'Rendering...' : t('ai.video_btn')}
                    </button>
                </div>

                {/* Preview */}
                <div className="bg-black rounded-xl flex items-center justify-center border border-gray-800 relative overflow-hidden shadow-inner">
                     {status.isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white p-8 text-center">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h3 className="font-display text-xl mb-2 animate-pulse">{status.statusMessage}</h3>
                            <p className="text-gray-400 text-sm">This can take a minute. We are synthesizing pixels...</p>
                        </div>
                    )}
                    
                    {videoUrl ? (
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-center text-gray-600">
                             <span className="material-icons-outlined text-6xl mb-4">movie_filter</span>
                             <p className="font-display">Video preview</p>
                        </div>
                    )}
                    {status.error && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 text-red-400 p-6 text-center">
                            <p>{status.error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiLabPage;
