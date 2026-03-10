import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/shared/components/AdminHeader';
import { supabase } from '@/services/supabaseClient';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Stat { value: string; label: string; icon: string; }
interface HistoriaData {
    title1: string; title2: string;
    paragraph1: string; paragraph2: string;
    badgeTitle: string; badgeValue: string; badgeUnit: string; badgeDesc: string;
    bgUrl: string;
    stats: Stat[];
}
interface Finca {
    nombre: string; municipio: string; departamento: string;
    altitud: string; perfil: string; proceso: string; notas: string;
    icon: string; color: string;
}
interface Testimonio {
    nombre: string; ciudad: string; rating: number; texto: string; compra: string;
}

type Tab = 'historia' | 'fincas' | 'testimonios';

// ─────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────
const DEFAULT_HISTORIA: HistoriaData = {
    title1: 'Nace en', title2: 'las nubes',
    paragraph1: 'En las faldas de la Sierra Nevada de Santa Marta, donde la niebla del Caribe besa las cumbres nevadas, nace un café único en el mundo.',
    paragraph2: 'Cada grano que llega a tu taza es producto de décadas de conocimiento transmitido de generación en generación.',
    badgeTitle: 'Altitud promedio', badgeValue: '2.100', badgeUnit: 'msnm', badgeDesc: 'Sierra Nevada · Magdalena',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDThTiqynQIa-ilci3zIhgZChfLRM4f1wVfnxQes6Pgbt0fiENkSzRaEZqeH4DzTvfxMFSudxYZ8J23n4DcT2DVwzwcO1Dx_V3l9HhmRxJ2ko0IXGCyQHBgTyhraGqBG9UOv1uCuRxnQduF8GWIZs4CUyl_cSMpUCI99JCX-1juZTytNwl3HJeatheVPkxiyN2uUtqT8XJ_0H8BTnQfmUQWp2rhFuQES4wiAYO54PSXRxb8KFLJjI2B-VL6R3b51Yp8mPPyvhxZqCM',
    stats: [
        { value: '98', label: 'Familias cafeteras', icon: 'groups' },
        { value: '+40', label: 'Años de tradición', icon: 'history_edu' },
        { value: '3', label: 'Generaciones', icon: 'family_restroom' },
        { value: '3.000', label: 'msnm máxima altitud', icon: 'terrain' },
    ],
};
const DEFAULT_FINCAS: Finca[] = [
    { nombre: 'La Jagua', municipio: 'La Jagua de Ibirico', departamento: 'Magdalena', altitud: '1.980', perfil: 'Floral · Cítrico · Té negro', proceso: 'Lavado', notas: 'Jazmín · Bergamota · Durazno', icon: 'spa', color: '#C8AA6E' },
    { nombre: 'San Pedro', municipio: 'San Pedro de la Sierra', departamento: 'Magdalena', altitud: '2.200', perfil: 'Frutal · Brillante · Dulce', proceso: 'Honey', notas: 'Mora · Maracuyá · Panela', icon: 'local_florist', color: '#E5CF9E' },
    { nombre: 'Minca', municipio: 'Santa Marta · Minca', departamento: 'Magdalena', altitud: '1.600', perfil: 'Cacao · Especiado · Denso', proceso: 'Natural', notas: 'Chocolate · Canela · Uva pasa', icon: 'eco', color: '#A07840' },
];
const DEFAULT_TESTIMONIOS: Testimonio[] = [
    { nombre: 'María Camila R.', ciudad: 'Bogotá', rating: 5, texto: 'Nunca pensé que un café pudiera hacerme sentir que estoy en la montaña.', compra: 'Café Malú Reserva · 500g' },
    { nombre: 'Carlos A. Méndez', ciudad: 'Medellín', rating: 5, texto: 'Trabajo con varios tostadores y Origen Sierra Nevada tiene algo diferente: la trazabilidad real.', compra: 'Suscripción Mensual · Canal B2B' },
    { nombre: 'Valentina Torres', ciudad: 'Cali', rating: 5, texto: 'El proceso de compra fue tan bueno como el café. Llegó en 2 días, empaque impecable.', compra: 'San Pedro Natural · 250g' },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const MATERIAL_ICONS = ['spa', 'local_florist', 'eco', 'terrain', 'coffee', 'water_drop', 'nature', 'grass', 'park', 'cloud', 'bolt', 'star', 'favorite'];
const PROCESO_OPTIONS = ['Lavado', 'Honey', 'Natural', 'Anaeróbico', 'Carbónico', 'Doble Fermentación'];

function InputRow({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
    const cls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A065] focus:outline-none transition-all text-sm';
    return (
        <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065] mb-1 block">{label}</label>
            {multiline
                ? <textarea className={cls + ' resize-none h-24'} value={value} onChange={e => onChange(e.target.value)} />
                : <input className={cls} value={value} onChange={e => onChange(e.target.value)} />}
        </div>
    );
}

function Badge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#C5A065]/30 text-[#C5A065] text-[9px] font-bold uppercase tracking-widest">
            {text}
        </span>
    );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const SiteContentManager: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('historia');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    // ── Historia state ──
    const [historia, setHistoria] = useState<HistoriaData>(DEFAULT_HISTORIA);

    // ── Fincas state ──
    const [fincas, setFincas] = useState<Finca[]>(DEFAULT_FINCAS);
    const [editingFincaIdx, setEditingFincaIdx] = useState<number | null>(null);
    const [fincaForm, setFincaForm] = useState<Finca | null>(null);

    // ── Testimonios state ──
    const [testimonios, setTestimonios] = useState<Testimonio[]>(DEFAULT_TESTIMONIOS);
    const [editingTestIdx, setEditingTestIdx] = useState<number | null>(null);
    const [testForm, setTestForm] = useState<Testimonio | null>(null);

    // ─────────────────────────────────────────
    // LOAD FROM DB
    // ─────────────────────────────────────────
    const loadConfig = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('site_configs').select('*');
            if (error || !data) return;
            data.forEach((row: any) => {
                if (row.id === 'historia') setHistoria({ ...DEFAULT_HISTORIA, ...row.data });
                if (row.id === 'fincas') setFincas(row.data?.list ?? DEFAULT_FINCAS);
                if (row.id === 'testimonios') setTestimonios(row.data?.list ?? DEFAULT_TESTIMONIOS);
            });
        } catch (e) {
            console.warn('site_configs not available yet', e);
        }
    }, []);

    useEffect(() => { loadConfig(); }, [loadConfig]);

    // ─────────────────────────────────────────
    // SAVE HELPER
    // ─────────────────────────────────────────
    const upsert = async (id: string, data: object) => {
        setSaving(true);
        const { error } = await supabase
            .from('site_configs')
            .upsert({ id, data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
        setSaving(false);
        if (error) {
            setToast({ type: 'error', msg: 'Error al guardar: ' + error.message });
        } else {
            setToast({ type: 'success', msg: '¡Cambios publicados correctamente!' });
        }
        setTimeout(() => setToast(null), 4000);
    };

    // ─────────────────────────────────────────
    // HISTORIA HANDLERS
    // ─────────────────────────────────────────
    const updateStat = (idx: number, field: keyof Stat, val: string) => {
        setHistoria(prev => {
            const stats = [...prev.stats];
            stats[idx] = { ...stats[idx], [field]: val };
            return { ...prev, stats };
        });
    };

    // ─────────────────────────────────────────
    // FINCA HANDLERS
    // ─────────────────────────────────────────
    const startEditFinca = (idx: number) => { setEditingFincaIdx(idx); setFincaForm({ ...fincas[idx] }); };
    const startNewFinca = () => {
        const blank: Finca = { nombre: '', municipio: '', departamento: 'Magdalena', altitud: '', perfil: '', proceso: 'Natural', notas: '', icon: 'eco', color: '#C8AA6E' };
        setFincas(prev => [...prev, blank]);
        setEditingFincaIdx(fincas.length);
        setFincaForm(blank);
    };
    const saveFinca = () => {
        if (!fincaForm || editingFincaIdx === null) return;
        const updated = [...fincas];
        updated[editingFincaIdx] = fincaForm;
        setFincas(updated);
        setEditingFincaIdx(null);
        setFincaForm(null);
    };
    const deleteFinca = (idx: number) => {
        setFincas(prev => prev.filter((_, i) => i !== idx));
        setEditingFincaIdx(null);
        setFincaForm(null);
    };

    // ─────────────────────────────────────────
    // TESTIMONIO HANDLERS
    // ─────────────────────────────────────────
    const startEditTest = (idx: number) => { setEditingTestIdx(idx); setTestForm({ ...testimonios[idx] }); };
    const startNewTest = () => {
        const blank: Testimonio = { nombre: '', ciudad: '', rating: 5, texto: '', compra: '' };
        setTestimonios(prev => [...prev, blank]);
        setEditingTestIdx(testimonios.length);
        setTestForm(blank);
    };
    const saveTest = () => {
        if (!testForm || editingTestIdx === null) return;
        const updated = [...testimonios];
        updated[editingTestIdx] = testForm;
        setTestimonios(updated);
        setEditingTestIdx(null);
        setTestForm(null);
    };
    const deleteTest = (idx: number) => {
        setTestimonios(prev => prev.filter((_, i) => i !== idx));
        setEditingTestIdx(null);
        setTestForm(null);
    };

    // ─────────────────────────────────────────
    // TABS CONFIG
    // ─────────────────────────────────────────
    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'historia', label: 'Historia', icon: 'history_edu' },
        { id: 'fincas', label: 'Terroir · Fincas', icon: 'map' },
        { id: 'testimonios', label: 'Testimonios', icon: 'forum' },
    ];

    return (
        <div className="min-h-screen bg-[#0B120D] text-white font-sans">
            <AdminHeader title="CONTENIDO DEL SITIO" />

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold transition-all animate-slide-up ${toast.type === 'success' ? 'bg-emerald-800 text-emerald-200 border border-emerald-600' : 'bg-red-900 text-red-200 border border-red-700'}`}>
                    <span className="material-icons-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
                    {toast.msg}
                </div>
            )}

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-10">
                    <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/30 hover:text-[#C5A065] transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="material-icons-outlined text-base">arrow_back</span>
                        Volver al dashboard
                    </button>
                    <h1 className="text-4xl font-serif text-[#C5A065] mb-2">Gestión de Contenido</h1>
                    <p className="text-white/40 font-light">Edita y publica en tiempo real las secciones narrativas del sitio web.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

                    {/* ── SIDEBAR NAV ── */}
                    <aside className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setEditingFincaIdx(null); setEditingTestIdx(null); }}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left border ${activeTab === tab.id ? 'bg-[#C5A065]/15 border-[#C5A065]/40 text-[#C5A065]' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white hover:border-white/20'}`}
                            >
                                <span className="material-icons-outlined">{tab.icon}</span>
                                <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold mb-3 px-1">Acceso rápido</p>
                            {[
                                { label: 'Productos', icon: 'inventory_2', path: '/admin/products' },
                                { label: 'Pedidos', icon: 'shopping_bag', path: '/admin/orders' },
                                { label: 'Usuarios', icon: 'group', path: '/admin/users' },
                            ].map(item => (
                                <button key={item.path} onClick={() => navigate(item.path)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold uppercase tracking-widest">
                                    <span className="material-icons-outlined text-sm">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* ── CONTENT PANEL ── */}
                    <div className="min-h-[600px]">

                        {/* ════════════════════════════
                            TAB: HISTORIA
                        ════════════════════════════ */}
                        {activeTab === 'historia' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-serif text-white">Sección Historia</h2>
                                        <p className="text-white/30 text-sm mt-1">Textos, estadísticas y fotografía de fondo del bloque "Nace en las nubes".</p>
                                    </div>
                                    <button
                                        onClick={() => upsert('historia', historia)}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#C5A065] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4B075] transition-all disabled:opacity-50"
                                    >
                                        {saving ? <span className="material-icons-outlined text-sm animate-spin">refresh</span> : <span className="material-icons-outlined text-sm">cloud_upload</span>}
                                        Publicar Cambios
                                    </button>
                                </div>

                                {/* Títulos */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                                    <Badge text="Encabezado" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputRow label="Línea 1 del título" value={historia.title1} onChange={v => setHistoria(p => ({ ...p, title1: v }))} />
                                        <InputRow label="Línea 2 (en cursiva dorada)" value={historia.title2} onChange={v => setHistoria(p => ({ ...p, title2: v }))} />
                                    </div>
                                    <InputRow label="Párrafo principal" value={historia.paragraph1} onChange={v => setHistoria(p => ({ ...p, paragraph1: v }))} multiline />
                                    <InputRow label="Párrafo secundario" value={historia.paragraph2} onChange={v => setHistoria(p => ({ ...p, paragraph2: v }))} multiline />
                                </div>

                                {/* Badge flotante */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                                    <Badge text="Insignia flotante" />
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <InputRow label="Título insignia" value={historia.badgeTitle} onChange={v => setHistoria(p => ({ ...p, badgeTitle: v }))} />
                                        <InputRow label="Valor numérico" value={historia.badgeValue} onChange={v => setHistoria(p => ({ ...p, badgeValue: v }))} />
                                        <InputRow label="Unidad" value={historia.badgeUnit} onChange={v => setHistoria(p => ({ ...p, badgeUnit: v }))} />
                                        <InputRow label="Descripción" value={historia.badgeDesc} onChange={v => setHistoria(p => ({ ...p, badgeDesc: v }))} />
                                    </div>
                                </div>

                                {/* Imagen de fondo */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                                    <Badge text="Fotografía de fondo" />
                                    <InputRow label="URL de la imagen" value={historia.bgUrl} onChange={v => setHistoria(p => ({ ...p, bgUrl: v }))} />
                                    {historia.bgUrl && (
                                        <div className="h-32 rounded-xl overflow-hidden border border-white/10">
                                            <img src={historia.bgUrl} alt="Preview" className="w-full h-full object-cover opacity-70" />
                                        </div>
                                    )}
                                </div>

                                {/* Estadísticas */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                                    <Badge text="Estadísticas (4 cifras)" />
                                    {historia.stats.map((stat, i) => (
                                        <div key={i} className="grid grid-cols-3 gap-3 items-end">
                                            <InputRow label={`Valor ${i + 1}`} value={stat.value} onChange={v => updateStat(i, 'value', v)} />
                                            <InputRow label="Etiqueta" value={stat.label} onChange={v => updateStat(i, 'label', v)} />
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065] mb-1 block">Ícono Material</label>
                                                <select
                                                    value={stat.icon}
                                                    onChange={e => updateStat(i, 'icon', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A065] focus:outline-none transition-all text-sm"
                                                >
                                                    {MATERIAL_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ════════════════════════════
                            TAB: FINCAS / TERROIR
                        ════════════════════════════ */}
                        {activeTab === 'fincas' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-serif text-white">Sección Terroir · Fincas</h2>
                                        <p className="text-white/30 text-sm mt-1">Agrega, edita o elimina las fincas de origen que aparecen en el mapa interactivo.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={startNewFinca}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            <span className="material-icons-outlined text-sm">add</span> Nueva Finca
                                        </button>
                                        <button
                                            onClick={() => upsert('fincas', { list: fincas })}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[#C5A065] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4B075] transition-all disabled:opacity-50"
                                        >
                                            {saving ? <span className="material-icons-outlined text-sm animate-spin">refresh</span> : <span className="material-icons-outlined text-sm">cloud_upload</span>}
                                            Publicar
                                        </button>
                                    </div>
                                </div>

                                {/* List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fincas.map((finca, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative rounded-2xl border p-5 transition-all ${editingFincaIdx === idx ? 'border-[#C5A065]/60 bg-[#141E16]/60' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}
                                        >
                                            {editingFincaIdx === idx && fincaForm ? (
                                                // ── EDIT FORM ──
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-bold text-[#C5A065] uppercase tracking-widest mb-2">Editando finca #{idx + 1}</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <InputRow label="Nombre" value={fincaForm.nombre} onChange={v => setFincaForm(p => p && ({ ...p, nombre: v }))} />
                                                        <InputRow label="Municipio" value={fincaForm.municipio} onChange={v => setFincaForm(p => p && ({ ...p, municipio: v }))} />
                                                        <InputRow label="Departamento" value={fincaForm.departamento} onChange={v => setFincaForm(p => p && ({ ...p, departamento: v }))} />
                                                        <InputRow label="Altitud (msnm)" value={fincaForm.altitud} onChange={v => setFincaForm(p => p && ({ ...p, altitud: v }))} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <InputRow label="Perfil de taza" value={fincaForm.perfil} onChange={v => setFincaForm(p => p && ({ ...p, perfil: v }))} />
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065] mb-1 block">Proceso</label>
                                                            <select value={fincaForm.proceso} onChange={e => setFincaForm(p => p && ({ ...p, proceso: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A065] focus:outline-none transition-all text-sm">
                                                                {PROCESO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <InputRow label="Notas de cata (separadas por · )" value={fincaForm.notas} onChange={v => setFincaForm(p => p && ({ ...p, notas: v }))} />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065] mb-1 block">Ícono</label>
                                                            <select value={fincaForm.icon} onChange={e => setFincaForm(p => p && ({ ...p, icon: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A065] focus:outline-none transition-all text-sm">
                                                                {MATERIAL_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                                            </select>
                                                        </div>
                                                        <InputRow label="Color (hex)" value={fincaForm.color} onChange={v => setFincaForm(p => p && ({ ...p, color: v }))} />
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <button onClick={saveFinca} className="flex-1 py-2.5 bg-[#C5A065] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4B075] transition-all">Guardar</button>
                                                        <button onClick={() => { setEditingFincaIdx(null); setFincaForm(null); }} className="px-4 py-2.5 bg-white/5 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Cancelar</button>
                                                        <button onClick={() => deleteFinca(idx)} className="px-4 py-2.5 bg-red-900/40 border border-red-700/30 text-red-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-900/70 transition-all">
                                                            <span className="material-icons-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // ── DISPLAY CARD ──
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="material-icons-outlined text-sm" style={{ color: finca.color }}>{finca.icon}</span>
                                                            <h3 className="font-serif text-xl text-white">{finca.nombre || 'Sin nombre'}</h3>
                                                        </div>
                                                        <p className="text-white/30 text-xs">{finca.municipio} · {finca.altitud} msnm</p>
                                                        <p className="text-white/40 text-xs mt-1">{finca.proceso} · {finca.perfil}</p>
                                                    </div>
                                                    <button onClick={() => startEditFinca(idx)} className="p-2 rounded-lg bg-white/5 hover:bg-[#C5A065]/20 text-white/40 hover:text-[#C5A065] transition-all">
                                                        <span className="material-icons-outlined text-sm">edit</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ════════════════════════════
                            TAB: TESTIMONIOS
                        ════════════════════════════ */}
                        {activeTab === 'testimonios' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-serif text-white">Sección Testimonios</h2>
                                        <p className="text-white/30 text-sm mt-1">Gestiona las reseñas de clientes que aparecen en la página principal.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={startNewTest}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            <span className="material-icons-outlined text-sm">add</span> Nueva Reseña
                                        </button>
                                        <button
                                            onClick={() => upsert('testimonios', { list: testimonios })}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[#C5A065] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4B075] transition-all disabled:opacity-50"
                                        >
                                            {saving ? <span className="material-icons-outlined text-sm animate-spin">refresh</span> : <span className="material-icons-outlined text-sm">cloud_upload</span>}
                                            Publicar
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {testimonios.map((t, idx) => (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl border p-5 transition-all ${editingTestIdx === idx ? 'border-[#C5A065]/60 bg-[#141E16]/60' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}
                                        >
                                            {editingTestIdx === idx && testForm ? (
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-bold text-[#C5A065] uppercase tracking-widest">Editando reseña</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <InputRow label="Nombre del cliente" value={testForm.nombre} onChange={v => setTestForm(p => p && ({ ...p, nombre: v }))} />
                                                        <InputRow label="Ciudad" value={testForm.ciudad} onChange={v => setTestForm(p => p && ({ ...p, ciudad: v }))} />
                                                    </div>
                                                    <InputRow label="Reseña / Testimonio" value={testForm.texto} onChange={v => setTestForm(p => p && ({ ...p, texto: v }))} multiline />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <InputRow label="Producto comprado" value={testForm.compra} onChange={v => setTestForm(p => p && ({ ...p, compra: v }))} />
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A065] mb-1 block">Puntuación</label>
                                                            <div className="flex gap-1 mt-2">
                                                                {[1, 2, 3, 4, 5].map(n => (
                                                                    <button key={n} onClick={() => setTestForm(p => p && ({ ...p, rating: n }))} className={`material-icons-outlined text-2xl transition-colors ${testForm.rating >= n ? 'text-[#C5A065]' : 'text-white/20 hover:text-[#C5A065]/50'}`}>star</button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <button onClick={saveTest} className="flex-1 py-2.5 bg-[#C5A065] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4B075] transition-all">Guardar</button>
                                                        <button onClick={() => { setEditingTestIdx(null); setTestForm(null); }} className="px-4 py-2.5 bg-white/5 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Cancelar</button>
                                                        <button onClick={() => deleteTest(idx)} className="px-4 py-2.5 bg-red-900/40 border border-red-700/30 text-red-400 font-bold text-xs rounded-xl hover:bg-red-900/70 transition-all">
                                                            <span className="material-icons-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex gap-0.5 mb-2">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <span key={i} className={`material-icons-outlined text-xs ${i < t.rating ? 'text-[#C5A065]' : 'text-white/10'}`}>star</span>
                                                            ))}
                                                        </div>
                                                        <p className="text-white/60 text-xs italic mb-2 line-clamp-2">"{t.texto}"</p>
                                                        <p className="text-white font-bold text-sm">{t.nombre || 'Sin nombre'}</p>
                                                        <p className="text-white/30 text-[10px]">{t.ciudad} · {t.compra}</p>
                                                    </div>
                                                    <button onClick={() => startEditTest(idx)} className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-[#C5A065]/20 text-white/40 hover:text-[#C5A065] transition-all">
                                                        <span className="material-icons-outlined text-sm">edit</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SiteContentManager;
