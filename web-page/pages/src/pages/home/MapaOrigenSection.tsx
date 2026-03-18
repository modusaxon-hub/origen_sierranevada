
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductTraceability, Finca } from '@/shared/types';

interface MapaOrigenSectionProps {
    traceability?: ProductTraceability;
    fallbackFincas?: Finca[];
}

const MapaOrigenSection: React.FC<MapaOrigenSectionProps> = ({ traceability, fallbackFincas }) => {
    const { language } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';

    // Priorize product fincas, then fallback from site_configs
    const fincas = (traceability?.fincas && traceability.fincas.length > 0)
        ? traceability.fincas
        : (fallbackFincas || []);

    if (fincas.length === 0) return null;

    return (
        <section className="py-24 bg-[#050810] relative overflow-hidden border-t border-white/5">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8AA6E]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C8AA6E]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-[#C8AA6E] font-medium tracking-[0.2em] text-sm uppercase mb-4 block">
                        {lang === 'es' ? 'Trazabilidad y Terroir' : 'Traceability & Terroir'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-playfair mb-6 text-white leading-tight">
                        {lang === 'es' ? 'Nuestro ' : 'Our '}
                        <span className="italic font-light opacity-80">Terroir</span>
                    </h2>
                    <p className="text-white/60 text-lg">
                        {lang === 'es'
                            ? 'Cada taza tiene coordenadas. Conoce las fincas donde nació tu café.'
                            : 'Every cup has coordinates. Discover the farms where your coffee was born.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
                    {fincas.map((finca, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-[#C8AA6E]/30 transition-all duration-500 overflow-hidden"
                        >
                            {/* Accent line */}
                            <div
                                className="absolute top-0 left-0 w-1 h-full opacity-30 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: finca.color || '#C8AA6E' }}
                            />

                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                {/* Farm Icon/Image placeholder */}
                                <div className="w-24 h-24 rounded-2xl bg-[#C8AA6E]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                    <span
                                        className="material-icons-outlined text-4xl"
                                        style={{ color: finca.color || '#C8AA6E' }}
                                    >
                                        {finca.icon || 'terrain'}
                                    </span>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-playfair text-white">{finca.nombre}</h3>
                                        <div className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                                            <span className="material-icons-outlined text-sm text-[#C8AA6E]">location_on</span>
                                            <span className="text-xs text-white/70 font-medium">
                                                {finca.municipio}, {finca.departamento}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-6">
                                        <div>
                                            <span className="text-[10px] text-[#C8AA6E] uppercase tracking-wider block mb-1 opacity-70">
                                                {lang === 'es' ? 'Altitud' : 'Altitude'}
                                            </span>
                                            <span className="text-white font-playfair text-lg flex items-baseline gap-1">
                                                {finca.altitud} <span className="text-[10px] lowercase opacity-40">msnm</span>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#C8AA6E] uppercase tracking-wider block mb-1 opacity-70">
                                                {lang === 'es' ? 'Proceso' : 'Process'}
                                            </span>
                                            <span className="text-white font-playfair text-lg">
                                                {finca.proceso}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <span className="text-[10px] text-[#C8AA6E] uppercase tracking-wider block mb-3 opacity-70">
                                    {lang === 'es' ? 'Perfil de Sabor y Notas' : 'Flavor Profile & Notes'}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {finca.perfil.split(' · ').map((note, nIdx) => (
                                        <span
                                            key={nIdx}
                                            className="bg-white/5 text-white/80 py-1 px-3 rounded-lg text-xs border border-white/10"
                                        >
                                            {note}
                                        </span>
                                    ))}
                                    {/* Sensory notes */}
                                    <span className="w-full mt-2 text-sm italic text-white/40">
                                        "{finca.notas}"
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {traceability?.notes && (
                    <div className="mt-16 max-w-2xl mx-auto text-center">
                        <p className="text-white/40 italic text-sm">
                            {traceability.notes[lang]}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MapaOrigenSection;
