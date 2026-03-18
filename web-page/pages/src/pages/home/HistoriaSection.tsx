
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductStory } from '@/shared/types';

interface HistoriaSectionProps {
    story?: ProductStory;
    fallbackStory?: ProductStory;
}

const HistoriaSection: React.FC<HistoriaSectionProps> = ({ story, fallbackStory }) => {
    const { language } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';

    // Priorize product story, then fallback
    const s = (story?.paragraph1 && story.paragraph1[lang]) ? story : fallbackStory;

    if (!s) return null;

    return (
        <section className="py-24 bg-[#050806] relative overflow-hidden">
            {/* Background Image with Mask */}
            <div className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000">
                <img
                    src={s.bgUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDThTiqynQIa-ilci3zIhgZChfLRM4f1wVfnxQes6Pgbt0fiENkSzRaEZqeH4DzTvfxMFSudxYZ8J23n4DcT2DVwzwcO1Dx_V3l9HhmRxJ2ko0IXGCyQHBgTyhraGqBG9UOv1uCuRxnQduF8GWIZs4CUyl_cSMpUCI99JCX-1juZTytNwl3HJeatheVPkxiyN2uUtqT8XJ_0H8BTnQfmUQWp2rhFuQES4wiAYO54PSXRxb8KFLJjI2B-VL6R3b51Yp8mPPyvhxZqCM'}
                    alt="Cafetal Background"
                    className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050806] via-transparent to-[#050806]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left: Content Card */}
                    <div className="lg:w-1/2 group">
                        <div className="relative bg-[#0A0D0B] border border-white/5 p-10 md:p-14 rounded-[3rem] shadow-2xl transition-all duration-700 hover:border-[#C8AA6E]/20">
                            {/* Decorative badge */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#C8AA6E] rounded-full flex flex-col items-center justify-center p-2 text-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                <span className="text-[10px] uppercase font-bold tracking-tighter text-[#050806] leading-none opacity-60">
                                    {(s.badgeTitle && s.badgeTitle[lang]) || (lang === 'es' ? 'Altitud' : 'Altitude')}
                                </span>
                                <span className="text-2xl font-playfair font-black text-[#050806] my-1">
                                    {(s.badgeValue && s.badgeValue[lang]) || '1.100'}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-[#050806] leading-none opacity-60">
                                    {(s.badgeUnit && s.badgeUnit[lang]) || 'msnm'}
                                </span>
                            </div>

                            <span className="text-[#C8AA6E] font-medium tracking-[0.2em] text-sm uppercase mb-6 block">
                                {(s.badgeDesc && s.badgeDesc[lang]) || (lang === 'es' ? 'Sierra Nevada · Magdalena' : 'Sierra Nevada · Colombia')}
                            </span>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-8 text-white leading-tight">
                                {(s.title1 && s.title1[lang]) || (lang === 'es' ? 'En las faldas de ' : 'On the slopes of ')}
                                <span className="italic block mt-2 opacity-80 decoration-[#C8AA6E]/30 underline-offset-8 underline">
                                    {(s.title2 && s.title2[lang]) || (lang === 'es' ? 'La Sierra Nevada' : 'The Sierra Nevada')}
                                </span>
                            </h2>

                            <div className="space-y-6 text-lg text-white/70 leading-relaxed font-light">
                                <p>{(s.paragraph1 && s.paragraph1[lang]) || ''}</p>
                                <p>{(s.paragraph2 && s.paragraph2[lang]) || ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats and Visual Element */}
                    <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
                        {(s.stats && s.stats.length > 0) ? s.stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-[#C8AA6E]/10 hover:border-[#C8AA6E]/30 transition-all duration-500 group"
                            >
                                <span className="material-icons-outlined text-3xl text-[#C8AA6E] mb-4 opacity-70 group-hover:scale-125 transition-transform duration-500">
                                    {stat.icon}
                                </span>
                                <span className="text-3xl font-playfair text-white mb-2">{stat.value}</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</span>
                            </div>
                        )) : (
                            // Default stats if empty
                            [
                                { icon: 'groups', value: '98', label: lang === 'es' ? 'Familias' : 'Families' },
                                { icon: 'history_edu', value: '+40', label: lang === 'es' ? 'Años' : 'Years' },
                                { icon: 'terrain', value: '3.333', label: lang === 'es' ? 'Altitud Máxima' : 'Max Altitude' },
                                { icon: 'water_drop', value: '100%', label: lang === 'es' ? 'Orgánico' : 'Organic' }
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-[#C8AA6E]/10 hover:border-[#C8AA6E]/30 transition-all duration-500 group"
                                >
                                    <span className="material-icons-outlined text-3xl text-[#C8AA6E] mb-4 opacity-70 group-hover:scale-125 transition-transform duration-500">
                                        {stat.icon}
                                    </span>
                                    <span className="text-3xl font-playfair text-white mb-2">{stat.value}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HistoriaSection;
