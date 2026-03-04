import React, { useEffect, useRef } from 'react';

const TESTIMONIOS = [
    {
        nombre: 'María Camila R.',
        ciudad: 'Bogotá',
        rating: 5,
        texto: 'Nunca pensé que un café pudiera hacerme sentir que estoy en la montaña. El Café Malú me dejó sin palabras: floral, brillante, con una acidez que se convierte en dulzura.',
        compra: 'Café Malú Reserva · 500g',
    },
    {
        nombre: 'Carlos A. Méndez',
        ciudad: 'Medellín',
        rating: 5,
        texto: 'Trabajo con varios tostadores y Origen Sierra Nevada tiene algo diferente: la trazabilidad real. Sé exactamente de qué finca viene cada bolsa. Eso no tiene precio.',
        compra: 'Suscripción Mensual · Canal B2B',
    },
    {
        nombre: 'Valentina Torres',
        ciudad: 'Cali',
        rating: 5,
        texto: 'El proceso de compra fue tan bueno como el café. Llegó en 2 días, empaque impecable y una nota de la finca de origen. Se los recomiendo a todos mis amigos.',
        compra: 'San Pedro Natural · 250g',
    },
    {
        nombre: 'Santiago López',
        ciudad: 'Barranquilla',
        rating: 5,
        texto: 'El café de Minca es extraordinario para espresso. El perfil de cacao y canela lo convierte en el mejor "después del almuerzo" que he probado en años.',
        compra: 'Minca Natural · Espresso',
    },
    {
        nombre: 'Laura Jiménez',
        ciudad: 'Cartagena',
        rating: 5,
        texto: 'Pedí el kit con el dripper Chemex y fue amor a primera vista. El café honey de San Pedro en pour over es simplemente transcendente. Gracias Origen.',
        compra: 'Kit Barista · San Pedro Honey',
    },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <span
                key={i}
                className={`material-icons-outlined text-sm ${i < rating ? 'text-[#C8AA6E]' : 'text-white/10'}`}
            >
                star
            </span>
        ))}
    </div>
);

const TestimoniosSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            }),
            { threshold: 0.1 }
        );
        const targets = sectionRef.current?.querySelectorAll('.animate-on-scroll');
        targets?.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-[#141E16]/40 overflow-hidden">
            <div className="absolute inset-0 bg-[#050806]/60" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8AA6E]/20 to-transparent" />
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#C8AA6E]/3 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-on-scroll">
                    <p className="text-[#C8AA6E]/60 text-[9px] uppercase tracking-[0.7em] font-bold mb-4">Comunidad</p>
                    <h2 className="font-serif text-5xl md:text-6xl text-white mb-4">
                        Lo que dicen<br />
                        <span className="text-[#C8AA6E] italic">nuestros rituales</span>
                    </h2>
                    <p className="text-white/30 text-sm max-w-md mx-auto font-light">
                        Más de 500 familias ya tienen su café de la Sierra en casa.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {TESTIMONIOS.map((t, idx) => (
                        <div
                            key={idx}
                            className="animate-on-scroll group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-7 flex flex-col hover:border-[#C8AA6E]/20 hover:bg-[#141E16]/40 transition-all duration-500"
                            style={{ transitionDelay: `${idx * 60}ms` }}
                        >
                            {/* Stars */}
                            <StarRating rating={t.rating} />

                            {/* Quote */}
                            <p className="text-white/60 text-sm leading-relaxed font-light italic mt-4 mb-6 flex-1">
                                "{t.texto}"
                            </p>

                            {/* Divider */}
                            <div className="w-full h-px bg-white/5 mb-5" />

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 flex items-center justify-center shrink-0">
                                    <span className="font-serif text-[#C8AA6E] text-base font-bold">
                                        {t.nombre.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{t.nombre}</p>
                                    <p className="text-white/30 text-[10px] truncate">{t.ciudad} · {t.compra}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA bottom */}
                <div className="text-center mt-12 animate-on-scroll">
                    <p className="text-white/20 text-xs uppercase tracking-[0.4em] font-bold">
                        ★ 4.9 / 5 · +500 reseñas verificadas
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TestimoniosSection;
