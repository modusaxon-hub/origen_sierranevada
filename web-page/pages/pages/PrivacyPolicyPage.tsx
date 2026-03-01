import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import { Shield, Eye, Trash2, Mail, Lock, FileText } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
    const { language } = useLanguage();

    const content = {
        es: {
            badge: 'Transparencia y Ética',
            title: 'Tu Privacidad es Nuestra Prioridad',
            intro: 'En Origen Sierra Nevada, respetamos la tierra y a quienes la habitan. Esa misma filosofía guía cómo protegemos tus datos bajo la Ley 1581 de 2012 (Colombia) y estándares internacionales de privacidad por diseño.',
            summaryTitle: 'Lo que debes saber (TL;DR)',
            summaryLines: [
                'Solo pedimos lo necesario para entregarte el mejor café.',
                'Tus datos están cifrados y seguros.',
                'Tú tienes el control: puedes editar o borrar tu info cuando quieras.'
            ],
            sections: [
                {
                    icon: <Eye className="w-6 h-6" />,
                    title: '¿Qué información recolectamos?',
                    body: 'Recopilamos datos de identificación (nombre, dirección de entrega) y contacto (email). No recolectamos datos sensibles ni información financiera directamente; para eso usamos aliados de pago certificados (PCI-DSS).'
                },
                {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'Finalidad del Tratamiento',
                    body: 'Usamos tu información para procesar pedidos, coordinar la logística desde la Sierra y, solo con tu autorización previa, enviarte novedades sobre nuestras cosechas y proyectos sociales.'
                },
                {
                    icon: <Trash2 className="w-6 h-6" />,
                    title: 'Tus Derechos (Habeas Data)',
                    body: 'Como titular de los datos, tienes derecho a conocer, actualizar y rectificar tu información. Puedes revocar tu autorización en cualquier momento escribiendo a nuestro canal oficial.'
                },
                {
                    icon: <Lock className="w-6 h-6" />,
                    title: 'Seguridad de la Información',
                    body: 'Implementamos medidas técnicas y administrativas para evitar el acceso no autorizado, pérdida o alteración de tus datos personales.'
                }
            ],
            footerContact: '¿Dudas sobre tus datos?',
            footerAction: 'Escríbenos a origensierranevadasm@gmail.com',
            legalNotice: 'Origen Sierra Nevada S.A.S. actúa como responsable del tratamiento de datos personales.'
        },
        en: {
            badge: 'Transparency & Ethics',
            title: 'Your Privacy is Our Priority',
            intro: 'At Origen Sierra Nevada, we respect the land and its people. This same philosophy guides how we protect your data following international Privacy by Design standards and Colombian Law 1581.',
            summaryTitle: 'Quick Summary (TL;DR)',
            summaryLines: [
                'We only ask for what is needed to deliver the best coffee.',
                'Your data is encrypted and secure.',
                'You are in control: edit or delete your info anytime.'
            ],
            sections: [
                {
                    icon: <Eye className="w-6 h-6" />,
                    title: 'What information do we collect?',
                    body: 'Identification data (name, delivery address) and contact info (email). We do not collect sensitive data or financial information directly; we use PCI-DSS certified payment partners.'
                },
                {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'Purpose of Processing',
                    body: 'We use your information to process orders, coordinate logistics from the Sierra, and, only with prior authorization, send updates about our harvests and social projects.'
                },
                {
                    icon: <Trash2 className="w-6 h-6" />,
                    title: 'Your Rights',
                    body: 'You have the right to know, update, and rectify your information. You can revoke your authorization at any time by writing to our official channel.'
                },
                {
                    icon: <Lock className="w-6 h-6" />,
                    title: 'Data Security',
                    body: 'We implement technical and administrative measures to prevent unauthorized access, loss, or alteration of your personal data.'
                }
            ],
            footerContact: 'Questions about your data?',
            footerAction: 'Email us at origensierranevadasm@gmail.com',
            legalNotice: 'Origen Sierra Nevada S.A.S. is the controller of your personal data.'
        }
    };

    const t = language === 'es' ? content.es : content.en;

    return (
        <div className="min-h-screen bg-[#050806] text-white relative overflow-hidden">
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#C8AA6E]/5 to-transparent opa-20"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C8AA6E]/5 filter blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-24">
                {/* HEADER SECTION */}
                <div className="text-center mb-20 space-y-6">
                    <span className="inline-block px-4 py-1.5 border border-[#C8AA6E]/30 bg-[#C8AA6E]/5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8AA6E] animate-fade-in">
                        {t.badge}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white italic tracking-tight uppercase leading-tight">
                        {t.title}
                    </h1>
                    <div className="w-24 h-px bg-[#C8AA6E]/40 mx-auto"></div>
                    <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed font-light italic">
                        "{t.intro}"
                    </p>
                </div>

                {/* TL;DR SUMMARY CARD */}
                <div className="mb-20 p-8 md:p-12 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-xl relative group">
                    <div className="absolute -top-4 left-8 px-4 py-1 bg-[#C8AA6E] text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Resumen
                    </div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <FileText className="text-[#C8AA6E] w-5 h-5" />
                        {t.summaryTitle}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {t.summaryLines.map((line, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="w-4 h-4 rounded-full bg-[#C8AA6E]/20 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C8AA6E]"></div>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">{line}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DETAILED SECTIONS GRID */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {t.sections.map((section, idx) => (
                        <div key={idx} className="p-8 bg-white/[0.01] border border-white/5 rounded-xl hover:border-[#C8AA6E]/30 transition-all duration-500 group">
                            <div className="w-12 h-12 mb-6 rounded-lg bg-white/5 flex items-center justify-center text-[#C8AA6E] group-hover:bg-[#C8AA6E] group-hover:text-black transition-all duration-500">
                                {section.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">{section.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-light text-sm">
                                {section.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* FOOTER CALL TO ACTION */}
                <div className="text-center pt-16 border-t border-white/10">
                    <div className="inline-flex flex-col items-center space-y-4">
                        <div className="p-4 rounded-full bg-white/5 text-[#C8AA6E]">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h4 className="text-white font-medium">{t.footerContact}</h4>
                        <p className="text-[#C8AA6E] text-xl font-serif italic tracking-wide">
                            {t.footerAction}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-8">
                            {t.legalNotice}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
