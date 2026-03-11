import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { emailService } from '../../services/emailService';
import { supabase } from '../../services/supabaseClient';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
    const { t, language } = useLanguage();
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent || loading) return;

        setLoading(true);
        setStatus('idle');

        if (email) {
            try {
                // Guardar en DB
                const { error: dbError } = await supabase.from('newsletter_subscribers').insert([{ email }]);

                if (dbError && dbError.code !== '23505') { // 23505 is unique violation (already subscribed)
                    throw dbError;
                }

                // Enviar correo
                const emailResult = await emailService.sendNewsletterWelcome(email);

                if (emailResult.success) {
                    setStatus('success');
                } else {
                    console.warn('Suscripción procesada, pero el correo podría tardar:', emailResult.error);
                    setStatus('success'); // Still show success to user if DB worked
                }

                setEmail('');
                setTimeout(() => setStatus('idle'), 6000);
            } catch (error) {
                console.error('Error in subscription:', error);
                setStatus('error');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <footer className="bg-[#141E16]/80 backdrop-blur-xl text-white pt-24 pb-12 border-t-2 border-[#C8AA6E]/40 relative overflow-hidden">
            {/* Premium gradient flourish */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#C8AA6E]/60 to-transparent opacity-70"></div>

            {/* Background glow effect */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-radial-gradient(circle, rgba(200,170,110,0.1) 0%, transparent 70%) rounded-full blur-3xl opacity-30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                {/* Brand Section - Premium */}
                <div className="lg:col-span-1 text-center md:text-left group">
                    <span className="font-accent text-[10px] tracking-[0.4em] text-[#C8AA6E] mb-6 block uppercase font-bold">Desde 2025</span>
                    <div className="mb-8">
                        <Logo className="w-full max-w-[255px] h-auto mx-auto md:mx-0 filter brightness-110 drop-shadow-[0_0_30px_rgba(200,170,110,0.4)]" />
                    </div>
                    <p className="text-[#F5F5F5]/70 text-sm leading-relaxed mb-8 font-light">
                        Café de altura, cultivado en las montañas más puras de Colombia. Origen, sabor, propósito.
                    </p>
                    <div className="flex justify-center md:justify-start space-x-6">
                        <a href="#" className="text-[#C8AA6E]/60 hover:text-[#C8AA6E] transition-all duration-300 transform hover:scale-125 hover:-translate-y-1" title="Facebook">
                            <i className="fa-brands fa-facebook text-2xl"></i>
                        </a>
                        <a href="#" className="text-[#C8AA6E]/60 hover:text-[#C8AA6E] transition-all duration-300 transform hover:scale-125 hover:-translate-y-1" title="Instagram">
                            <i className="fa-brands fa-instagram text-2xl"></i>
                        </a>
                        <a href="#" className="text-[#C8AA6E]/60 hover:text-[#C8AA6E] transition-all duration-300 transform hover:scale-125 hover:-translate-y-1" title="Twitter">
                            <i className="fa-brands fa-twitter text-2xl"></i>
                        </a>
                        <a href="#" className="text-[#C8AA6E]/60 hover:text-[#C8AA6E] transition-all duration-300 transform hover:scale-125 hover:-translate-y-1" title="WhatsApp">
                            <i className="fa-brands fa-whatsapp text-2xl"></i>
                        </a>
                    </div>
                </div>

                {/* Navigation - Premium */}
                <div className="lg:col-span-1 text-center md:text-left">
                    <h3 className="font-display font-bold text-xs text-[#C8AA6E] uppercase tracking-[0.3em] mb-8 font-bold">Explorar</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/" className="text-[#F5F5F5]/70 hover:text-[#C8AA6E] transition-all duration-300 hover:translate-x-1 inline-block relative group">{t('nav.home')} <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8AA6E] group-hover:w-full transition-all duration-300"></span></Link></li>
                        {/* Enlaces de Suscripción y Guía removidos por solicitud de landing page pura */}
                        <li><Link to="/ai-lab" className="text-[#F5F5F5]/70 hover:text-[#C8AA6E] transition-all duration-300 hover:translate-x-1 inline-block relative group">{t('nav.ai')} <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8AA6E] group-hover:w-full transition-all duration-300"></span></Link></li>
                    </ul>
                </div>

                {/* Newsletter - Premium */}
                <div className="md:col-span-2 lg:col-span-2 bg-[#C8AA6E]/5 backdrop-blur-md border border-[#C8AA6E]/20 rounded-xl p-8 hover:border-[#C8AA6E]/40 transition-all duration-300">
                    <h3 className="font-display font-bold text-xs text-[#C8AA6E] uppercase tracking-[0.3em] mb-4">{t('footer.join')}</h3>
                    <p className="text-[#F5F5F5]/70 text-sm mb-8 leading-relaxed">
                        Recibe noticias sobre nuevas colecciones, eventos exclusivos y promociones especiales directo a tu email.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className="flex-1 bg-[#141E16]/40 border border-[#C8AA6E]/30 rounded-lg px-6 py-3.5 text-[#F5F5F5] placeholder-[#F5F5F5]/40 focus:outline-none focus:border-[#C8AA6E] focus:bg-[#141E16]/60 transition-all duration-300 backdrop-blur-sm font-light"
                            />
                            <button
                                type="submit"
                                disabled={!consent || loading}
                                className={`px-8 py-3.5 font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-300 font-display flex items-center justify-center gap-2 ${status === 'success'
                                    ? 'bg-green-600/80 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                    : 'bg-[#C8AA6E]/90 hover:bg-[#C8AA6E] text-[#141E16] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(200,170,110,0.4)] active:scale-95'}`}
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                                ) : status === 'success' ? (
                                    '✓ Suscrito'
                                ) : (
                                    'Suscribirse'
                                )}
                            </button>
                        </div>

                        {/* Habeas Data Checkbox - Premium */}
                        <div className="flex items-start gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="newsletter-consent"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mt-1.5 accent-[#C8AA6E] h-4 w-4 bg-[#C8AA6E]/20 border border-[#C8AA6E]/50 rounded cursor-pointer"
                                required
                            />
                            <label htmlFor="newsletter-consent" className="text-[10px] text-[#F5F5F5]/60 leading-tight cursor-pointer hover:text-[#F5F5F5]/80 transition-colors">
                                Acepto recibir comunicaciones de Origen Sierra Nevada y confirmo que he leído la {' '}<a href="#/privacy" className="text-[#C8AA6E] hover:underline">Política de Privacidad</a>
                            </label>
                        </div>
                        {status === 'success' && (
                            <p className="text-green-400/80 text-xs font-medium animate-pulse">
                                ✓ Revisa tu email para confirmar la suscripción
                            </p>
                        )}
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#C8AA6E]/20 pt-8 text-[10px] text-[#F5F5F5]/50 font-light">
                    <div className="text-center md:text-left">
                        <p>© 2026 <span className="text-[#C8AA6E] font-bold">Origen Sierra Nevada</span>. Todos los derechos reservados.</p>
                        <p className="text-[9px] mt-2 text-[#F5F5F5]/40">Cultivado en los picos más altos de Colombia • Certificado de calidad premium</p>
                    </div>
                    <div className="flex space-x-8 mt-6 md:mt-0 text-[#F5F5F5]/50">
                        <a className="hover:text-[#C8AA6E] transition-all duration-300 hover:translate-y-[-2px] relative group" href="#/privacy">
                            Privacidad
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8AA6E] group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a className="hover:text-[#C8AA6E] transition-all duration-300 hover:translate-y-[-2px] relative group" href="#/terms">
                            Términos
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8AA6E] group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a className="hover:text-[#C8AA6E] transition-all duration-300 hover:translate-y-[-2px] relative group" href="#/contact">
                            Contacto
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8AA6E] group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>
                </div>

                {/* MODUS AXON Seal */}
                <div className="text-center mt-12 pt-6 border-t border-[#C8AA6E]/10">
                    <p className="text-[8px] tracking-[0.2em] text-[#C8AA6E]/60 uppercase font-bold">
                        Desarrollado bajo el poder del diseño de <span className="text-[#C8AA6E]">MODUS AXON</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
