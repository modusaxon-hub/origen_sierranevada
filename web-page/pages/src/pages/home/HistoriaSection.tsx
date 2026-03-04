import React, { useEffect, useRef } from 'react';

const STATS = [
    { value: '98', label: 'Familias cafeteras', icon: 'groups' },
    { value: '+40', label: 'Años de tradición', icon: 'history_edu' },
    { value: '3', label: 'Generaciones', icon: 'family_restroom' },
    { value: '3.000', label: 'msnm máxima altitud', icon: 'terrain' },
];

const HistoriaSection: React.FC = () => {
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
        <section ref={sectionRef} className="relative py-24 md:py-36 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center animate-ken-burns"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(20,30,22,0.97) 0%, rgba(20,30,22,0.80) 50%, rgba(20,30,22,0.40) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDThTiqynQIa-ilci3zIhgZChfLRM4f1wVfnxQes6Pgbt0fiENkSzRaEZqeH4DzTvfxMFSudxYZ8J23n4DcT2DVwzwcO1Dx_V3l9HhmRxJ2ko0IXGCyQHBgTyhraGqBG9UOv1uCuRxnQduF8GWIZs4CUyl_cSMpUCI99JCX-1juZTytNwl3HJeatheVPkxiyN2uUtqT8XJ_0H8BTnQfmUQWp2rhFuQES4wiAYO54PSXRxb8KFLJjI2B-VL6R3b51Yp8mPPyvhxZqCM')`
                    }}
                />
            </div>

            {/* Border top */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8AA6E]/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* LEFT — Texto */}
                    <div className="space-y-8">
                        {/* Eyebrow */}
                        <div className="animate-on-scroll">
                            <p className="text-[#C8AA6E]/60 text-[9px] uppercase tracking-[0.7em] font-bold mb-2">Nuestra Historia</p>
                            <div className="w-8 h-px bg-[#C8AA6E]/40" />
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-5xl md:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight animate-on-scroll">
                            Nace en<br />
                            <span className="text-[#C8AA6E] italic">las nubes</span>
                        </h2>

                        {/* Body */}
                        <div className="space-y-4 animate-on-scroll">
                            <p className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                                En las faldas de la Sierra Nevada de Santa Marta, donde la niebla del Caribe besa las cumbres nevadas,
                                nace un café único en el mundo. A más de 1.800 metros sobre el nivel del mar, el frío nocturno y
                                la brisa del trópico crean un equilibrio irrepetible.
                            </p>
                            <p className="text-white/40 text-sm md:text-base leading-relaxed font-light">
                                Cada grano que llega a tu taza es producto de décadas de conocimiento transmitido de generación
                                en generación. Las familias que cuidan estos cafetales no producen volumen: producen
                                <em className="text-[#C8AA6E]/80"> expresión</em>.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-[#C8AA6E]/20 to-transparent animate-on-scroll" />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 animate-on-scroll">
                            {STATS.map((stat, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="material-icons-outlined text-[#C8AA6E]/60 text-base">{stat.icon}</span>
                                        <span className="font-serif text-3xl text-white">{stat.value}</span>
                                    </div>
                                    <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold pl-7">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Visual card (desktop only) */}
                    <div className="hidden lg:block animate-on-scroll">
                        <div className="relative">
                            {/* Main card */}
                            <div className="rounded-2xl overflow-hidden border border-[#C8AA6E]/20 shadow-2xl shadow-black/50">
                                <div
                                    className="h-[480px] bg-cover bg-center animate-ken-burns"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDThTiqynQIa-ilci3zIhgZChfLRM4f1wVfnxQes6Pgbt0fiENkSzRaEZqeH4DzTvfxMFSudxYZ8J23n4DcT2DVwzwcO1Dx_V3l9HhmRxJ2ko0IXGCyQHBgTyhraGqBG9UOv1uCuRxnQduF8GWIZs4CUyl_cSMpUCI99JCX-1juZTytNwl3HJeatheVPkxiyN2uUtqT8XJ_0H8BTnQfmUQWp2rhFuQES4wiAYO54PSXRxb8KFLJjI2B-VL6R3b51Yp8mPPyvhxZqCM')`
                                    }}
                                />
                                {/* Overlay bottom */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#141E16] to-transparent" />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -left-6 bg-[#141E16]/90 backdrop-blur-xl border border-[#C8AA6E]/30 rounded-xl p-5 shadow-2xl">
                                <p className="text-[9px] text-[#C8AA6E]/60 uppercase tracking-widest font-bold mb-1">Altitud promedio</p>
                                <p className="font-serif text-3xl text-white">2.100 <span className="text-[#C8AA6E] text-lg">msnm</span></p>
                                <p className="text-white/30 text-[9px] mt-1">Sierra Nevada · Magdalena</p>
                            </div>

                            {/* Decorative corner */}
                            <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-[#C8AA6E]/30 rounded-tr-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Border bottom */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8AA6E]/20 to-transparent" />
        </section>
    );
};

export default HistoriaSection;
