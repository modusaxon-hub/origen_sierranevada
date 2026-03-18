
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Testimonial } from '@/shared/types';

interface TestimoniosSectionProps {
    testimonials?: Testimonial[];
    fallbackTestimonials?: Testimonial[];
}

const TestimoniosSection: React.FC<TestimoniosSectionProps> = ({ testimonials, fallbackTestimonials }) => {
    const { language } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';

    const list = (testimonials && testimonials.length > 0) ? testimonials : (fallbackTestimonials || []);

    if (list.length === 0) return null;

    return (
        <section className="py-24 bg-[#050806] relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-[#C8AA6E] font-medium tracking-[0.2em] text-sm uppercase mb-4 block">
                        {lang === 'es' ? 'La Experiencia' : 'The Experience'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-playfair mb-6 text-white italic">
                        {lang === 'es' ? 'Testimonios de ' : 'Testimonials of '}
                        <span className="not-italic text-white opacity-40">Origen</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {list.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] relative group hover:bg-[#C8AA6E]/5 hover:border-[#C8AA6E]/20 transition-all duration-500"
                        >
                            <span className="material-icons-outlined text-4xl text-[#C8AA6E] opacity-20 absolute top-8 right-8 group-hover:opacity-40 transition-opacity">
                                format_quote
                            </span>

                            <div className="flex gap-1 mb-8">
                                {[...Array(t.rating)].map((_, rIdx) => (
                                    <span key={rIdx} className="material-icons-outlined text-[#C8AA6E] text-sm">star</span>
                                ))}
                            </div>

                            <p className="text-lg text-white/70 italic mb-10 leading-relaxed font-light">
                                "{t.texto}"
                            </p>

                            <div className="pt-8 border-t border-white/5">
                                <h4 className="text-white font-medium mb-1">{t.nombre}</h4>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-widest text-[#C8AA6E]">{t.ciudad}</span>
                                    <span className="text-[10px] text-white/30 uppercase tracking-wider">{t.compra}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimoniosSection;
