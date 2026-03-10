import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

// ── Tipos ──────────────────────────────────────
interface Finca {
    nombre: string;
    municipio: string;
    departamento: string;
    altitud: string;
    perfil: string;
    proceso: string;
    notas: string;
    icon: string;
    color: string;
}

const DEFAULT_FINCAS: Finca[] = [
    { nombre: 'La Jagua', municipio: 'La Jagua de Ibirico', departamento: 'Magdalena', altitud: '1.980', perfil: 'Floral · Cítrico · Té negro', proceso: 'Lavado', notas: 'Jazmín · Bergamota · Durazno', icon: 'spa', color: '#C8AA6E' },
    { nombre: 'San Pedro', municipio: 'San Pedro de la Sierra', departamento: 'Magdalena', altitud: '2.200', perfil: 'Frutal · Brillante · Dulce', proceso: 'Honey', notas: 'Mora · Maracuyá · Panela', icon: 'local_florist', color: '#E5CF9E' },
    { nombre: 'Minca', municipio: 'Santa Marta · Minca', departamento: 'Magdalena', altitud: '1.600', perfil: 'Cacao · Especiado · Denso', proceso: 'Natural', notas: 'Chocolate · Canela · Uva pasa', icon: 'eco', color: '#A07840' },
];

const MapaOrigenSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [fincas, setFincas] = useState<Finca[]>(DEFAULT_FINCAS);

    // ── Cargar fincas desde Supabase ──────────────
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_configs')
                    .select('data')
                    .eq('id', 'fincas')
                    .single();
                if (!error && data?.data?.list?.length > 0) {
                    setFincas(data.data.list);
                }
            } catch { /* usa DEFAULT */ }
        };
        fetch();
    }, []);

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
    }, [fincas]);

    const activeFinca = fincas[activeIdx] ?? fincas[0];

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-[#050806] overflow-hidden">
            {/* Ambient */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C8AA6E]/4 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8AA6E]/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-on-scroll">
                    <p className="text-[#C8AA6E]/60 text-[9px] uppercase tracking-[0.7em] font-bold mb-4">Trazabilidad</p>
                    <h2 className="font-serif text-5xl md:text-6xl text-white mb-4">
                        Nuestro <span className="text-[#C8AA6E] italic">Terroir</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-xl mx-auto font-light">
                        Cada taza tiene coordenadas. Conoce las fincas donde nació tu café.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
                    {fincas.map((finca, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`animate-on-scroll text-left rounded-2xl border p-6 md:p-8 transition-all duration-500 group relative overflow-hidden ${activeIdx === idx
                                ? 'border-[#C8AA6E]/50 bg-[#141E16]/80 shadow-[0_0_30px_rgba(200,170,110,0.1)]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                }`}
                        >
                            {/* Active indicator */}
                            {activeIdx === idx && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C8AA6E]/0 via-[#C8AA6E] to-[#C8AA6E]/0" />
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeIdx === idx ? 'bg-[#C8AA6E]/20' : 'bg-white/5'}`}>
                                    <span className={`material-icons-outlined text-xl ${activeIdx === idx ? 'text-[#C8AA6E]' : 'text-white/30'}`}>{finca.icon}</span>
                                </div>
                                {/* Pulse marker */}
                                <div className="relative flex items-center justify-center">
                                    <div className={`w-3 h-3 rounded-full ${activeIdx === idx ? 'bg-[#C8AA6E]' : 'bg-white/20'}`} />
                                    {activeIdx === idx && (
                                        <div className="absolute w-6 h-6 rounded-full bg-[#C8AA6E]/30 animate-ping-slow" />
                                    )}
                                </div>
                            </div>

                            <h3 className={`font-serif text-2xl mb-1 ${activeIdx === idx ? 'text-[#C8AA6E]' : 'text-white/70'}`}>{finca.nombre}</h3>
                            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-4">{finca.municipio}</p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-white/20 text-sm">terrain</span>
                                    <span className="text-white/50 text-xs">{finca.altitud} msnm</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-white/20 text-sm">science</span>
                                    <span className="text-white/50 text-xs">Proceso: {finca.proceso}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail panel */}
                {activeFinca && (
                    <div className="animate-on-scroll rounded-2xl border border-[#C8AA6E]/20 bg-[#141E16]/60 backdrop-blur-xl p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left: Info */}
                            <div>
                                <p className="text-[#C8AA6E]/60 text-[9px] uppercase tracking-[0.5em] font-bold mb-2">Finca Activa</p>
                                <h3 className="font-serif text-4xl text-[#C8AA6E] mb-1">{activeFinca.nombre}</h3>
                                <p className="text-white/30 text-xs uppercase tracking-widest mb-6">{activeFinca.departamento} · {activeFinca.altitud} msnm</p>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-bold mb-2">Perfil de Taza</p>
                                        <p className="text-white/70 text-sm">{activeFinca.perfil}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-bold mb-2">Notas de Cata</p>
                                        <div className="flex flex-wrap gap-2">
                                            {activeFinca.notas.split(' · ').map((nota, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full border border-[#C8AA6E]/20 text-[#C8AA6E]/80 text-xs font-serif italic">
                                                    {nota}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Visual */}
                            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center animate-ken-burns opacity-60"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDThTiqynQIa-ilci3zIhgZChfLRM4f1wVfnxQes6Pgbt0fiENkSzRaEZqeH4DzTvfxMFSudxYZ8J23n4DcT2DVwzwcO1Dx_V3l9HhmRxJ2ko0IXGCyQHBgTyhraGqBG9UOv1uCuRxnQduF8GWIZs4CUyl_cSMpUCI99JCX-1juZTytNwl3HJeatheVPkxiyN2uUtqT8XJ_0H8BTnQfmUQWp2rhFuQES4wiAYO54PSXRxb8KFLJjI2B-VL6R3b51Yp8mPPyvhxZqCM')`
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141E16] via-transparent to-transparent" />
                                {/* Coordinates badge */}
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
                                    <p className="text-[9px] text-[#C8AA6E] uppercase tracking-widest font-bold">Coordenadas</p>
                                    <p className="text-white/60 font-mono text-xs">10.8° N · 74.0° W</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MapaOrigenSection;
