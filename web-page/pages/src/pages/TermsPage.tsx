import React from 'react';
import { useLanguage } from '@/shared/store/LanguageContext';
import Footer from '@/shared/components/Footer';
import { Truck, Scale, CreditCard, RefreshCcw, Coffee, AlertCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
    const { language } = useLanguage();

    const content = {
        es: {
            badge: 'Contrato de Confianza',
            title: 'Términos y Condiciones',
            intro: 'Al adquirir nuestro café de especialidad, entras en un acuerdo de respeto mutuo y transparencia. Estas reglas protegen tus derechos como consumidor y aseguran que la magia de la Sierra llegue intacta a tu taza.',
            sections: [
                {
                    icon: <Truck className="w-6 h-6" />,
                    title: '1. Envíos desde la Montaña',
                    body: 'Tostamos bajo pedido para garantizar frescura. Los envíos salen directamente desde zonas cercanas a la Sierra Nevada de Santa Marta. El tiempo estimado es de 2 a 5 días hábiles según tu ubicación en Colombia.'
                },
                {
                    icon: <Coffee className="w-6 h-6" />,
                    title: '2. Calidad de Origen',
                    body: 'Cada grano es seleccionado rigurosamente. Si detectas alguna anomalía en el empaque o la calidad del producto al recibirlo, cuentas con nuestro respaldo total para el cambio inmediato.'
                },
                {
                    icon: <CreditCard className="w-6 h-6" />,
                    title: '3. Pagos y Transacciones',
                    body: 'Procesamos tus pagos a través de plataformas cifradas de alta seguridad. Los precios incluyen los impuestos de ley colombiana. No almacenamos datos sensibles de tus tarjetas.'
                },
                {
                    icon: <RefreshCcw className="w-6 h-6" />,
                    title: '4. Cambios y Retracto',
                    body: 'Según la Ley 1480, tienes derecho al retracto dentro de los 5 días hábiles tras recibir el café, siempre que el empaque original permanezca sellado por tratarse de un bien de consumo alimenticio.'
                }
            ],
            extraNotice: {
                title: 'Importante para Suscriptores',
                body: 'Las suscripciones pueden ser pausadas o canceladas en cualquier momento desde tu panel de usuario, sin penalizaciones escondidas.'
            },
            footer: 'Respetamos la Ley 1480 de 2011 (Estatuto del Consumidor).'
        },
        en: {
            badge: 'Trust Agreement',
            title: 'Terms and Conditions',
            intro: 'By purchasing our specialty coffee, you enter into an agreement of mutual respect and transparency. These rules protect your consumer rights and ensure that the magic of the Sierra reaches your cup intact.',
            sections: [
                {
                    icon: <Truck className="w-6 h-6" />,
                    title: '1. Shipping from the Mountain',
                    body: 'We roast to order to guarantee freshness. Shipments leave directly from areas near the Sierra Nevada de Santa Marta. Estimated delivery is 2-5 business days within Colombia.'
                },
                {
                    icon: <Coffee className="w-6 h-6" />,
                    title: '2. Origin Quality',
                    body: 'Every bean is rigorously selected. If you notice any anomaly in the packaging or product quality upon receipt, you have our full support for an immediate exchange.'
                },
                {
                    icon: <CreditCard className="w-6 h-6" />,
                    title: '3. Payments & Transactions',
                    body: 'We process your payments through high-security encrypted platforms. Prices include Colombian taxes. We do not store sensitive credit card data.'
                },
                {
                    icon: <RefreshCcw className="w-6 h-6" />,
                    title: '4. Returns & Right of Withdrawal',
                    body: 'According to Law 1480, you have the right to withdraw within 5 business days after receiving the coffee, provided the original packaging remains sealed as it is a food consumption item.'
                }
            ],
            extraNotice: {
                title: 'Important for Subscribers',
                body: 'Subscriptions can be paused or canceled at any time from your user dashboard, with no hidden penalties.'
            },
            footer: 'Compliant with Law 1480 of 2011 (Consumer Statute).'
        }
    };

    const t = language === 'es' ? content.es : content.en;

    return (
        <div className="min-h-screen bg-[#050806] text-white relative overflow-hidden">
            {/* BACKGROUND GRADIENTS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-[#C8AA6E]/5 to-transparent opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-24">
                {/* HEADER */}
                <div className="text-center mb-24 space-y-6">
                    <span className="inline-block px-4 py-1.5 border border-[#C8AA6E]/30 bg-[#C8AA6E]/5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8AA6E]">
                        {t.badge}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white italic tracking-tight uppercase">
                        {t.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed font-light italic">
                        "{t.intro}"
                    </p>
                </div>

                {/* TERMS GRID */}
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    {t.sections.map((section, idx) => (
                        <div key={idx} className="space-y-4 group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-[#C8AA6E] group-hover:bg-[#C8AA6E] group-hover:text-black transition-all duration-500">
                                    {section.icon}
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest">{section.title}</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed pl-16">
                                {section.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* SPECIAL BOX FOR SUBSCRIBERS */}
                <div className="p-8 md:p-12 bg-[#C8AA6E]/5 border border-[#C8AA6E]/20 rounded-2xl flex flex-col md:flex-row gap-8 items-center">
                    <div className="p-4 bg-[#C8AA6E]/10 rounded-full">
                        <AlertCircle className="w-8 h-8 text-[#C8AA6E]" />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-bold text-white mb-2">{t.extraNotice.title}</h4>
                        <p className="text-gray-400">{t.extraNotice.body}</p>
                    </div>
                </div>

                <div className="mt-24 text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em]">
                        {t.footer}
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsPage;
