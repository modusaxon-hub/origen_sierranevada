import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Cookie, X, ShieldCheck, ChevronRight } from 'lucide-react';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const texts = {
        es: {
            title: 'Respeto por tu rastro digital',
            message: 'Al igual que cuidamos el origen de nuestro café, protegemos tu navegación. Usamos cookies para que tu experiencia sea tan fluida como un buen filtrado.',
            accept: 'Aceptar Experiencia Completa',
            decline: 'Solo lo esencial',
            policy: 'Tu privacidad en detalle'
        },
        en: {
            title: 'Respect for your digital footprint',
            message: 'Just as we care for the origin of our coffee, we protect your browsing. We use cookies to make your experience as smooth as a good pour-over.',
            accept: 'Accept Full Experience',
            decline: 'Essential only',
            policy: 'Your privacy in detail'
        }
    };

    const t = language === 'es' ? texts.es : texts.en;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-[100] animate-fade-in-up">
            <div className="bg-[#050806]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                {/* DECORATIVE ELEMENT */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C8AA6E]"></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-[#C8AA6E]/10 text-[#C8AA6E] shrink-0">
                    <Cookie size={32} />
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <ShieldCheck size={14} className="text-[#C8AA6E]" />
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">{t.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t.message}
                        </p>
                    </div>

                    <Link
                        to="/privacy"
                        onClick={() => setIsVisible(false)}
                        className="inline-flex items-center gap-2 text-[#C8AA6E] text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors group"
                    >
                        {t.policy}
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-6 py-3 rounded-full border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all order-2 sm:order-1"
                    >
                        {t.decline}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-8 py-3 rounded-full bg-[#C8AA6E] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#C8AA6E]/20 order-1 sm:order-2"
                    >
                        {t.accept}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
