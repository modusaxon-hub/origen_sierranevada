import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailService } from '@/services/emailService';
import { CONTACTS, getWhatsAppLink } from '@/constants/contacts';
import Footer from '@/shared/components/Footer';
import InstitutionalModal from '@/shared/components/InstitutionalModal';

const ContactPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [institutionalModal, setInstitutionalModal] = useState<{
        title: string;
        message: string | React.ReactNode;
        type: 'success' | 'info' | 'error' | 'warning';
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Enviar email al admin
            await emailService.sendOrderNotification(CONTACTS.email.support, {
                type: 'CONTACTO_FORMULARIO',
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono,
                asunto: formData.asunto,
                mensaje: formData.mensaje,
                timestamp: new Date().toISOString(),
            });

            setSubmitted(true);
            setTimeout(() => {
                setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
                setSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error('Error sending contact form:', error);
            setInstitutionalModal({
                title: 'Error de Envío',
                message: 'No pudimos enviar tu mensaje en este momento. Por favor, intenta de nuevo más tarde o contáctanos por WhatsApp.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050806] text-white pt-24 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-6">
                {/* Hero Section */}
                <section className="text-center mb-20">
                    <div className="inline-block py-1 px-3 border border-[#C8AA6E]/30 rounded-full bg-[#C8AA6E]/5 mb-6">
                        <span className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-[0.2em]">Estamos Aquí Para Ti</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif tracking-tight mb-6">
                        Contáctanos
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        ¿Preguntas sobre nuestros cafés de especialidad? ¿Necesitas ayuda con tu pedido?
                        Nos encantaría escucharte. Elige tu forma favorita de conectar.
                    </p>
                </section>

                {/* Contact Methods Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* WhatsApp Card */}
                    <a href={getWhatsAppLink('Hola, me gustaría conocer más sobre Origen Sierra Nevada')}
                        className="group relative bg-gradient-to-br from-[#25D366]/20 to-[#20BA5A]/10 border border-[#25D366]/50 hover:border-[#25D366] p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.2)] cursor-pointer">
                        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity">
                            <span className="text-5xl">💬</span>
                        </div>
                        <h3 className="text-2xl font-serif text-[#25D366] mb-3">WhatsApp</h3>
                        <p className="text-gray-400 font-light mb-6 leading-relaxed">
                            Respuesta inmediata en horario laboral. Perfecto para preguntas rápidas y confirmación de pedidos.
                        </p>
                        <div className="flex items-center gap-2 text-[#25D366] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                            Abrir Chat
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </div>
                    </a>

                    {/* Email Card */}
                    <a href={`mailto:${CONTACTS.email.support}`}
                        className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/20 hover:border-[#C8AA6E] p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,170,110,0.1)]">
                        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity">
                            <span className="text-5xl">📧</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#C8AA6E] transition-colors">Email</h3>
                        <p className="text-gray-400 font-light mb-6 leading-relaxed">
                            Respuesta en 24-48 horas. Ideal para consultas detalladas sobre pedidos corporativos o partnerships.
                        </p>
                        <div className="flex items-center gap-2 text-[#C8AA6E] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                            Enviar Email
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </div>
                    </a>

                    {/* Phone Card */}
                    <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/20 p-8 rounded-3xl">
                        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity">
                            <span className="text-5xl">📞</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-3">Teléfono</h3>
                        <p className="text-gray-400 font-light mb-6 leading-relaxed">
                            Llámanos durante el horario de atención. Nuestro equipo está listo para ayudarte.
                        </p>
                        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                            <span className="material-icons-outlined text-sm">schedule</span>
                            Lun-Vie 9AM-6PM
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="max-w-2xl mx-auto mb-20">
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 md:p-14">
                        <h2 className="text-3xl font-serif text-[#C8AA6E] mb-2 text-center">Envía tu Mensaje</h2>
                        <p className="text-gray-400 text-center mb-10 font-light">
                            Completa el formulario y nos pondremos en contacto a la brevedad.
                        </p>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <span className="material-icons-outlined text-green-400 text-5xl">done_all</span>
                                </div>
                                <h3 className="text-2xl font-serif text-green-400 mb-2">¡Mensaje Enviado!</h3>
                                <p className="text-gray-400">
                                    Gracias por tu mensaje. Nos pondremos en contacto pronto.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-[#C8AA6E] focus:outline-none transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E] mb-3">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-[#C8AA6E] focus:outline-none transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E] mb-3">
                                        Teléfono (Opcional)
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-[#C8AA6E] focus:outline-none transition-all"
                                        placeholder="+57 300 000 0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E] mb-3">
                                        Asunto
                                    </label>
                                    <select
                                        name="asunto"
                                        value={formData.asunto}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#C8AA6E] focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Selecciona un tema</option>
                                        <option value="pedido">Pregunta sobre un pedido</option>
                                        <option value="producto">Pregunta sobre productos</option>
                                        <option value="partnership">Propuesta comercial</option>
                                        <option value="feedback">Sugerencia o feedback</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8AA6E] mb-3">
                                        Mensaje
                                    </label>
                                    <textarea
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-[#C8AA6E] focus:outline-none transition-all resize-none"
                                        placeholder="Cuéntanos más sobre tu consulta..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#C8AA6E] text-black font-display font-bold py-5 px-6 rounded-xl uppercase tracking-[0.2em] hover:shadow-[0_0_25px_rgba(200,170,110,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                                >
                                    {loading ? (
                                        <>
                                            <span className="material-icons-outlined text-sm animate-spin">refresh</span>
                                            Enviando Mensaje...
                                        </>
                                    ) : (
                                        <>
                                            Enviar Mensaje
                                            <span className="material-icons-outlined text-sm">send</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                {/* Info Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-serif text-[#C8AA6E] mb-4">Horario de Atención</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>📅 <strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM (Hora Colombiana)</li>
                            <li>📅 <strong>Sábados:</strong> 10:00 AM - 4:00 PM</li>
                            <li>📅 <strong>Domingos:</strong> Cerrado (atención limitada)</li>
                            <li>⚡ WhatsApp disponible 24/7 para consultas urgentes</li>
                        </ul>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-serif text-[#C8AA6E] mb-4">Ubicación</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>📍 <strong>Origen Sierra Nevada SM</strong></li>
                            <li>Santa Marta, Magdalena</li>
                            <li>Colombia</li>
                            <li className="pt-4 border-t border-white/5">
                                Estamos en el corazón de la Sierra Nevada, donde nace nuestro café.
                            </li>
                        </ul>
                    </div>
                </section>
            </div>

            <Footer />
            <InstitutionalModal
                isOpen={!!institutionalModal}
                onClose={() => setInstitutionalModal(null)}
                title={institutionalModal?.title || ''}
                message={institutionalModal?.message || ''}
                type={institutionalModal?.type}
            />
        </div>
    );
};

export default ContactPage;
