
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/store/AuthContext';
import { authService } from '@/services/authService';
import { LogOut, ArrowLeft, Printer, Sidebar, Columns, Type, Palette, MessageSquare, Image, Smartphone, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Brandbook: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('identidad');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Intersection Observer logic for active section
            const sections = ['identidad', 'logo', 'colors', 'typography', 'voice', 'ui', 'photography'];
            const scrollPosition = window.scrollY + 200;

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(`¡Copiado!: ${text}`);
    };

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/login');
    };

    const navLinks = [
        { id: 'identidad', label: 'Identidad', icon: <HelpCircle size={18} /> },
        { id: 'logo', label: 'Logotipo', icon: <Columns size={18} /> },
        { id: 'colors', label: 'Colores', icon: <Palette size={18} /> },
        { id: 'typography', label: 'Tipografía', icon: <Type size={18} /> },
        { id: 'voice', label: 'Tono de Voz', icon: <MessageSquare size={18} /> },
        { id: 'ui', label: 'Elementos UI', icon: <Smartphone size={18} /> },
        { id: 'photography', label: 'Fotografía', icon: <Image size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-[#0B120D] text-white font-sans selection:bg-[#C8AA6E]/30">
            <style>{`
                .gold-gradient {
                    background: linear-gradient(135deg, #c8aa6e 0%, #e5cf9e 50%, #c8aa6e 100%);
                }
                .text-gold-gradient {
                    background: linear-gradient(135deg, #c8aa6e 0%, #e5cf9e 50%, #c8aa6e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .sidebar-link-active {
                    background: rgba(200, 170, 110, 0.1);
                    color: #c8aa6e;
                    border-left: 3px solid #c8aa6e !important;
                }
                @media print {
                    .no-print { display: none !important; }
                    main { margin-left: 0 !important; width: 100% !important; }
                    section { page-break-after: always; page-break-inside: avoid; }
                }
            `}</style>

            {/* Print Button */}
            <button
                onClick={() => window.print()}
                className="no-print fixed top-6 right-6 z-50 bg-[#C8AA6E] text-[#141f16] px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
            >
                <Printer size={16} />
                Imprimir
            </button>

            {/* Sidebar */}
            <aside className={`no-print fixed left-0 top-0 h-screen bg-[#141f16] border-r border-white/10 transition-all duration-300 z-50 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}`}>
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    {isSidebarOpen && (
                        <img
                            src="/images/brandbook/logo-completo-origen-sierra-nevada.svg"
                            alt="Logo"
                            className="h-10 w-auto brightness-0 invert opacity-70"
                        />
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <Sidebar size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navLinks.map(link => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all border-l-3 border-transparent ${activeSection === link.id ? 'sidebar-link-active' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                            {link.icon}
                            {isSidebarOpen && link.label}
                        </a>
                    ))}

                    <div className="pt-8 border-t border-white/5 mt-8">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-xs uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <ArrowLeft size={18} />
                            {isSidebarOpen && 'Panel Admin'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-xs uppercase tracking-widest text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        >
                            <LogOut size={18} />
                            {isSidebarOpen && 'Cerrar Sesión'}
                        </button>
                    </div>
                </nav>

                {isSidebarOpen && (
                    <div className="p-6 border-t border-white/10">
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium mb-1">Usuario</p>
                        <p className="text-[11px] text-white/60 truncate">{user?.email}</p>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>

                {/* Hero */}
                <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
                            style={{
                                backgroundImage: `linear-gradient(rgba(11, 18, 13, 0.85), rgba(11, 18, 13, 0.95)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDThTiqynQIa-ilci3zIhgZChfLRM4f1wVfnxQes6Pgbt0fiENkSzRaEZqeH4DzTvfxMFSudxYZ8J23n4DcT2DVwzwcO1Dx_V3l9HhmRxJ2ko0IXGCyQHBgTyhraGqBG9UOv1uCuRxnQduF8GWIZs4CUyl_cSMpUCI99JCX-1juZTytNwl3HJeatheVPkxiyN2uUtqT8XJ_0H8BTnQfmUQWp2rhFuQES4wiAYO54PSXRxb8KFLJjI2B-VL6R3b51Yp8mPPyvhxZqCM')`
                            }}
                        />
                    </div>
                    <div className="relative z-10 text-center max-w-4xl px-6">
                        <p className="text-[#C8AA6E] uppercase tracking-[0.5em] text-xs mb-6 animate-fade-in">Manual de Identidad Visual</p>
                        <h1 className="font-serif text-6xl md:text-8xl text-gold-gradient font-black leading-[1.1] mb-8">
                            ORIGEN SIERRA NEVADA
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light italic">
                            La esencia premium del café de altura capturada en un sistema visual sofisticado y editorial.
                        </p>
                        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
                            <a href="#identidad" className="min-w-[200px] border border-[#C8AA6E] text-[#C8AA6E] px-8 py-4 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#C8AA6E] hover:text-[#141f16] transition-all">
                                Explorar Manual
                            </a>
                            <div className="flex items-center gap-4 text-white/20">
                                <span className="w-12 h-px bg-white/10"></span>
                                <span className="text-[10px] uppercase tracking-widest">Edición 2026</span>
                                <span className="w-12 h-px bg-white/10"></span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Identidad */}
                <section id="identidad" className="py-32 px-6 max-w-7xl mx-auto border-y border-white/5">
                    <div className="text-center mb-24">
                        <p className="text-[#C8AA6E]/60 uppercase tracking-[0.5em] text-[10px] mb-4">Nuestra Esencia</p>
                        <h2 className="font-serif text-5xl md:text-6xl text-[#C8AA6E] mb-6">Identidad de Marca</h2>
                        <div className="w-16 h-1 bg-[#C8AA6E]/20 mx-auto"></div>
                    </div>

                    <div className="bg-[#141E16]/50 backdrop-blur-sm border border-[#C8AA6E]/20 rounded-3xl p-12 md:p-20 mb-16">
                        <div className="max-w-3xl mx-auto text-center">
                            <HelpCircle className="mx-auto text-[#C8AA6E] mb-8" size={48} />
                            <h3 className="font-serif text-3xl text-[#C8AA6E] mb-8">Nuestro Propósito</h3>
                            <p className="text-white/70 text-xl leading-relaxed font-light italic">
                                "Conectar a los amantes del café premium con el terroir único de la Sierra Nevada de Santa Marta,
                                preservando la tradición cafetera colombiana mientras innovamos en la experiencia del café de altura."
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Autenticidad', desc: 'Cada grano cuenta la historia real de su origen. Somos transparentes sobre nuestro proceso y nuestros productores.', icon: 'verified' },
                            { title: 'Excelencia', desc: 'Obsesión por la calidad en cada etapa: desde la selección manual del grano hasta el perfil de tueste único.', icon: 'star' },
                            { title: 'Sostenibilidad', desc: 'Compromiso con el ecosistema de la Sierra Nevada y con las familias cafeteras. Cultivo responsable.', icon: 'nature' },
                            { title: 'Tradición', desc: 'Honramos los métodos ancestrales de cultivo mientras adoptamos tecnología que mejora la calidad sin perder el alma.', icon: 'history_edu' },
                            { title: 'Premium', desc: 'No somos para todos. Nos dirigimos a quienes aprecian la complejidad, la procedencia y la experiencia sensorial.', icon: 'diamond' },
                            { title: 'Educación', desc: 'Creemos en formar paladares educados. Compartimos el conocimiento sobre nuestro terroir y procesos.', icon: 'local_library' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#C8AA6E]/40 transition-all group">
                                <div className="w-14 h-14 rounded-full bg-[#C8AA6E]/10 flex items-center justify-center mb-6 text-[#C8AA6E] group-hover:bg-[#C8AA6E] group-hover:text-[#141f16] transition-all">
                                    <span className="material-icons-outlined text-2xl">{item.icon}</span>
                                </div>
                                <h4 className="font-serif text-2xl text-[rgb(200,170,110)] mb-4">{item.title}</h4>
                                <p className="text-white/50 leading-relaxed text-sm font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Logo */}
                <section id="logo" className="py-32 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <p className="text-[#C8AA6E]/60 uppercase tracking-[0.5em] text-[10px] mb-4">Identidad Visual</p>
                        <h2 className="font-serif text-5xl md:text-6xl text-[#C8AA6E] mb-6">La Firma de la Tierra</h2>
                        <p className="text-white/40 max-w-2xl mx-auto leading-relaxed font-light italic">
                            El horizonte áureo que representa la cota de oro donde nace el mejor café del mundo.
                        </p>
                    </div>

                    <div className="bg-[#141E16]/30 border border-[#C8AA6E]/10 rounded-3xl p-12 md:p-24 flex items-center justify-center mb-16">
                        <img
                            src="/images/brandbook/La-firma-de-la-tierra.svg"
                            alt="Logo Firma"
                            className="w-full max-w-xl h-auto brightness-110 drop-shadow-[0_0_15px_rgba(200,170,110,0.3)]"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-12 flex flex-col items-center text-center">
                            <div className="mb-12 h-40 flex items-center justify-center">
                                <img src="/images/brandbook/logo-completo-origen-sierra-nevada.svg" alt="Versión Positiva" className="h-20 w-auto brightness-0 invert" />
                            </div>
                            <h4 className="font-serif text-xl text-[#C8AA6E] mb-2">Versión sobre Oscuro</h4>
                            <p className="text-white/30 text-xs uppercase tracking-widest font-medium">Uso Preferente</p>
                        </div>
                        <div className="bg-[#F5F5F5] border border-black/5 rounded-2xl p-12 flex flex-col items-center text-center">
                            <div className="mb-12 h-40 flex items-center justify-center">
                                <img src="/images/brandbook/logo-completo-origen-sierra-nevada.svg" alt="Versión Positiva" className="h-20 w-auto brightness-0 contrast-200" style={{ filter: 'grayscale(1) brightness(0.2)' }} />
                            </div>
                            <h4 className="font-serif text-xl text-[#141E16] mb-2 text-primary">Versión sobre Claro</h4>
                            <p className="text-black/30 text-xs uppercase tracking-widest font-medium">Uso Alternativo</p>
                        </div>
                    </div>
                </section>

                {/* Colores */}
                <section id="colors" className="py-32 px-6 max-w-7xl mx-auto border-y border-white/5">
                    <div className="mb-20">
                        <h2 className="font-serif text-5xl text-[#C8AA6E] mb-6">Paleta de Colores</h2>
                        <p className="text-white/50 max-w-2xl leading-relaxed font-light">
                            Inspirada en la profundidad de los bosques nubosos y la riqueza de la tierra volcánica de la Sierra Nevada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: 'Verde Origen', hex: '#141E16', rgb: '20, 30, 22', text: 'white' },
                            { name: 'Dorado Sierra', hex: '#C8AA6E', rgb: '200, 170, 110', text: 'primary' },
                            { name: 'Blanco Niebla', hex: '#F5F5F5', rgb: '245, 245, 245', text: 'charcoal' },
                            { name: 'Carbón Suave', hex: '#333333', rgb: '51, 51, 51', text: 'white' }
                        ].map((color, idx) => (
                            <div
                                key={idx}
                                onClick={() => copyToClipboard(color.hex)}
                                className="group cursor-pointer transform transition-all hover:-translate-y-2"
                            >
                                <div className="aspect-[3/4] rounded-2xl p-8 flex flex-col justify-end shadow-2xl overflow-hidden relative" style={{ backgroundColor: color.hex }}>
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                        <span className="material-icons-outlined text-[10px] text-white">content_copy</span>
                                        <span className="text-[10px] text-white font-bold tracking-widest uppercase">Copiar</span>
                                    </div>
                                    <div className="space-y-3 relative z-10">
                                        <h3 className={`font-serif text-2xl ${color.text === 'primary' ? 'text-[#141E16]' : color.text === 'charcoal' ? 'text-[#333333]' : 'text-white'}`}>{color.name}</h3>
                                        <div className={`pt-4 border-t ${color.text === 'primary' ? 'border-[#141E16]/20' : color.text === 'charcoal' ? 'border-[#333333]/20' : 'border-white/20'} space-y-1`}>
                                            <p className={`text-[10px] uppercase tracking-widest font-bold ${color.text === 'primary' ? 'text-[#141E16]/60' : color.text === 'charcoal' ? 'text-charcoal/60' : 'text-white/40'}`}>HEX {color.hex}</p>
                                            <p className={`text-[10px] uppercase tracking-widest font-bold ${color.text === 'primary' ? 'text-[#141E16]/60' : color.text === 'charcoal' ? 'text-charcoal/60' : 'text-white/40'}`}>RGB {color.rgb}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Typography */}
                <section id="typography" className="py-32 px-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24">
                        <div className="space-y-20">
                            <div>
                                <h2 className="font-serif text-5xl text-[#C8AA6E] mb-12">Tipografía</h2>
                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Principal / Titulares</span>
                                    <h3 className="font-serif text-2xl text-[#C8AA6E]">Playfair Display</h3>
                                </div>
                                <div className="space-y-8">
                                    <p className="font-serif text-7xl md:text-9xl leading-none tracking-tighter">Aa Bb Cc</p>
                                    <p className="font-serif text-xl italic text-white/60 leading-relaxed max-w-md">
                                        Utilizada para titulares elegantes y piezas editoriales. Transmite sofisticación y herencia.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Secundaria / Cuerpo</span>
                                    <h3 className="font-sans text-2xl text-[#C8AA6E]">Montserrat</h3>
                                </div>
                                <div className="space-y-8">
                                    <p className="font-sans text-6xl md:text-8xl leading-none tracking-tighter font-bold uppercase">Aa Bb Cc</p>
                                    <p className="font-sans text-lg text-white/50 leading-relaxed max-w-md font-light">
                                        Nuestra fuente de funcionalidad. Elegida por su extrema legibilidad y equilibrio moderno.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-3xl p-12 flex flex-col gap-12 sticky top-32 h-fit">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-[#C8AA6E] mb-8 font-bold flex items-center gap-2">
                                    <span className="w-8 h-px bg-[#C8AA6E]/30"></span>
                                    Jerarquía Editorial
                                </p>
                                <h1 className="font-serif text-6xl text-white mb-6">El Ritual del Origen</h1>
                                <h2 className="font-sans text-xs uppercase tracking-[0.5em] text-white/30 mb-10 font-bold">Capítulo II: La Cota de Oro</h2>
                                <p className="font-sans text-lg text-white/60 leading-relaxed font-light">
                                    En las faldas de la Sierra Nevada, donde la brisa del Caribe se encuentra con las cumbres nevadas,
                                    nace un café único. Cada taza captura la esencia de este paraíso perdido,
                                    ofreciendo un perfil sensorial complejo y profundamente auténtico.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-8 border border-white/10 rounded-2xl">
                                    <p className="font-serif text-4xl italic text-[#C8AA6E] mb-2 font-bold">"..."</p>
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Citas Editoriales</p>
                                </div>
                                <div className="p-8 border border-[#C8AA6E]/20 bg-[#C8AA6E]/5 rounded-2xl flex flex-col justify-center items-center text-center">
                                    <p className="font-sans font-black text-lg tracking-[0.3em] text-[#C8AA6E] mb-1">BOTÓN</p>
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">CTA Principal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer simple (no print ya tiene su estilo) */}
                <footer className="no-print py-20 border-t border-white/5 text-center px-6">
                    <img src="/images/brandbook/logo-completo-origen-sierra-nevada.svg" alt="Logo Footer" className="h-12 w-auto mx-auto mb-8 brightness-0 invert opacity-30" />
                    <p className="text-[10px] uppercase tracking-[0.5em] text-white/20">© 2026 Departamento de Diseño Origen Sierra Nevada</p>
                </footer>
            </main>
        </div>
    );
};

export default Brandbook;
