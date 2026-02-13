import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'es' | 'en';
export type Currency = 'COP' | 'USD';

interface LanguageContextType {
    language: Language;
    currency: Currency;
    toggleLanguage: () => void;
    t: (key: string, defaultText?: string) => string;
    formatPrice: (priceUSD: number) => string;
}

const translations: Record<string, Record<Language, string>> = {
    // Navbar
    'nav.home': { es: 'Inicio', en: 'Home' },
    'nav.sub': { es: 'Suscripción', en: 'Subscription' },
    'nav.guide': { es: 'Guía', en: 'Brewing Guide' },
    'nav.ai': { es: 'Laboratorio IA', en: 'AI Lab' },
    'nav.search_placeholder': { es: 'Buscar...', en: 'Type to search...' },
    'nav.cart_title': { es: 'Tu Carrito', en: 'Your Cart' },
    'nav.cart_empty': { es: 'Tu carrito está vacío', en: 'Your cart is empty' },
    'nav.cart_start': { es: 'Empezar a Comprar', en: 'Start Shopping' },
    'nav.checkout': { es: 'Pagar', en: 'Checkout' },
    'nav.subtotal': { es: 'Subtotal', en: 'Subtotal' },
    'nav.search_results': { es: 'Resultados', en: 'Results' },
    'nav.no_results': { es: 'No se encontraron resultados para', en: 'No results found for' },
    'nav.jump': { es: 'Ir a', en: 'Jump to' },

    // Home
    'home.hero.title_prefix': { es: 'Café', en: 'Café' },
    'home.hero.badge': { es: 'Especialidad Origen Único', en: 'Single Origin Specialty' },
    'home.reviews': { es: 'Reseñas', en: 'Reviews' },
    'home.desc': { es: 'Cultivado en las elevaciones místicas de la Sierra Nevada, Café Malu ofrece un equilibrio raro de acidez y cuerpo. Experimenta la herencia de generaciones en cada taza.', en: 'Grown in the mystical elevations of Sierra Nevada, Café Malu offers a rare balance of acidity and body. Experience the heritage of generations in every cup.' },
    'home.sub_save': { es: 'Suscríbete y Ahorra', en: 'Subscribe & Save' },
    'home.best_value': { es: 'Mejor Valor', en: 'Best Value' },
    'home.sub_details': { es: 'por bolsa 340g • Entrega mensual', en: 'per 12oz bag • Delivered monthly' },
    'home.onetime': { es: 'Compra Única', en: 'One-time' },
    'home.single_purchase': { es: 'Compra individual', en: 'Single purchase' },
    'home.add_cart': { es: 'Agregar al Carrito', en: 'Add to Cart' },
    'home.learn_more': { es: 'Leer Más', en: 'Learn More' },
    'home.story_title': { es: 'La Historia Detrás del Grano', en: 'The Story Behind Each Bean' },
    'home.story_desc': { es: 'En lo alto de los picos brumosos de la Sierra Nevada, donde las nubes tocan el suelo, se encuentra el origen de Café Malu. Cultivado por manos que han conocido estas tierras durante siglos, nuestros granos crecen bajo la sombra de árboles nativos, preservando la biodiversidad de la selva.', en: 'High in the misty peaks of the Sierra Nevada, where the clouds touch the soil, lies the origin of Café Malu. Cultivated by hands that have known these lands for centuries, our beans are shade-grown under a canopy of native trees, preserving the biodiversity of the rainforest.' },
    'home.trace_title': { es: 'Trazabilidad', en: 'Traceability' },
    'home.trace_desc': { es: 'Creemos en la transparencia total. Saber exactamente de dónde viene tu café te conecta con el viaje y las personas detrás de cada taza.', en: 'We believe in full transparency. Knowing exactly where your coffee comes from connects you to the journey and the people behind every cup.' },
    'home.producer': { es: 'Productor', en: 'Producer' },
    'home.region': { es: 'Región', en: 'Region' },
    'home.altitude': { es: 'Altitud', en: 'Altitude' },
    'home.roast_date': { es: 'Fecha Tueste', en: 'Roast Date' },
    'home.variety': { es: 'Variedad', en: 'Variety' },
    'home.high_alt': { es: 'Alta Altitud', en: 'High Altitude' },
    'home.washed': { es: 'Proceso Lavado', en: 'Washed Process' },
    'home.sustainable': { es: 'Sostenible', en: 'Sustainable' },
    'home.high_alt_sub': { es: '1,800m msnm', en: '1,800m above sea level' },
    'home.washed_sub': { es: 'Limpio y brillante', en: 'Clean, bright finish' },
    'home.sustainable_sub': { es: 'Amigable con aves', en: 'Bird-friendly farming' },

    // Subscription
    'sub.hero_sub': { es: 'Más que raro. Único.', en: 'More Than Rare. Unique.' },
    'sub.hero_title': { es: 'Crea Tu Ritual de Café', en: 'Build Your Personal Coffee Ritual' },
    'sub.step.1': { es: 'Perfil', en: 'Profile' },
    'sub.step.2': { es: 'Formato', en: 'Format' },
    'sub.step.3': { es: 'Frecuencia', en: 'Frequency' },
    'sub.step.4': { es: 'Resumen', en: 'Summary' },
    'sub.flavor_title': { es: 'Selecciona tu Perfil', en: 'Select Your Flavor Profile' },
    'sub.format_title': { es: 'Elige tu Formato', en: 'Choose Your Format' },
    'sub.frequency_title': { es: 'Elige tu Frecuencia', en: 'Choose Frequency' },
    'sub.your_selection': { es: 'Tu Selección', en: 'Your Selection' },
    'sub.shipment': { es: '/ envío', en: '/ shipment' },
    'sub.start_btn': { es: 'INICIAR SUSCRIPCIÓN', en: 'START SUBSCRIPTION' },
    'sub.modal_title': { es: 'Bienvenido a la Familia', en: 'Welcome to the Family' },
    'sub.modal_desc': { es: 'Tu suscripción para Sierra Nevada Signature Blend ha sido activada.', en: 'Your subscription for Sierra Nevada Signature Blend has been activated.' },
    'sub.modal_return': { es: 'Volver al Inicio', en: 'Return Home' },
    'sub.next_ship': { es: 'Próximo Envío', en: 'Next Shipment' },
    
    // Frequencies
    'sub.freq.weekly': { es: 'Semanal', en: 'Weekly' },
    'sub.freq.biweekly': { es: 'Quincenal', en: 'Every 2 Weeks' },
    'sub.freq.monthly': { es: 'Mensual', en: 'Monthly' },
    'sub.freq.weekly_desc': { es: 'Bebedor intenso', en: 'Serious drinker' },
    'sub.freq.biweekly_desc': { es: 'Recomendado', en: 'Recommended' },
    'sub.freq.monthly_desc': { es: 'Bebedor casual', en: 'Casual drinker' },

    // Brewing
    'brew.hero_title': { es: 'El Arte de la Extracción', en: 'The Art of Extraction' },
    'brew.hero_sub': { es: 'Dominando la Molienda', en: 'Mastering the Grind & Brew' },
    'brew.selector': { es: 'Selector de Molienda', en: 'Grind Selector' },
    'brew.interactive': { es: 'Guía Interactiva', en: 'Interactive Guide' },
    'brew.time': { es: 'Tiempo', en: 'Time' },
    'brew.texture': { es: 'Textura', en: 'Texture' },
    
    // AI Lab
    'ai.title': { es: 'El Laboratorio de Innovación', en: 'The Innovation Lab' },
    'ai.desc': { es: 'Experimenta el futuro del café con nuestras herramientas de Barista IA. Genera arte, analiza granos, crea videos o chatea con nuestro sistema experto.', en: 'Experience the future of coffee with our AI-powered Barista tools. Generate art, analyze beans, create videos, or chat with our expert system.' },
    'ai.tab.chat': { es: 'Conserje Café', en: 'Coffee Concierge' },
    'ai.tab.analyze': { es: 'Analizador', en: 'Bean Analyzer' },
    'ai.tab.generate': { es: 'Estudio Etiqueta', en: 'Label Studio' },
    'ai.tab.edit': { es: 'Filtro Foto', en: 'Photo Filter' },
    'ai.tab.video': { es: 'Cine Brew', en: 'Cinematic Brew' },
    'ai.prompt_label': { es: 'Instrucción', en: 'Prompt' },
    'ai.res_label': { es: 'Resolución', en: 'Resolution' },
    'ai.analyze_btn': { es: 'Analizar Calidad', en: 'Analyze Quality' },
    'ai.generate_btn': { es: 'Generar Arte', en: 'Generate Art' },
    'ai.edit_btn': { es: 'Aplicar Edición', en: 'Apply Edit' },
    'ai.video_btn': { es: 'Generar Video', en: 'Generate Video' },
    'ai.upload_placeholder': { es: 'Subir foto de granos o café', en: 'Upload photo of beans or brew' },
    'ai.notes_title': { es: 'Notas del Tostador', en: 'Roaster\'s Notes' },
    'ai.notes_placeholder': { es: 'Los resultados aparecerán aquí', en: 'Analysis results will appear here' },
    'ai.input_placeholder': { es: 'Pregunta sobre granos, ratios...', en: 'Ask about coffee beans, brewing ratios...' },

    // Chat Widget
    'chat.title': { es: 'Barista IA', en: 'AI Barista' },
    'chat.placeholder': { es: 'Pregunta sobre café...', en: 'Ask about coffee...' },

    // Footer
    'footer.explore': { es: 'Explorar', en: 'Explore' },
    'footer.join': { es: 'Únete al Ritual', en: 'Join the Ritual' },
    'footer.desc': { es: 'Suscríbete para recibir consejos de preparación y acceso anticipado a funciones de IA.', en: 'Subscribe to receive brewing tips, exclusive single-origin drops, and early access to our AI features.' },
    'footer.rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
    'footer.privacy': { es: 'Política de Privacidad', en: 'Privacy Policy' },
    'footer.terms': { es: 'Términos', en: 'Terms of Service' },
    'footer.shipping': { es: 'Envíos', en: 'Shipping' },
    'footer.enter_email': { es: 'Ingresa tu correo', en: 'Enter your email address' },
    'footer.sub_btn': { es: 'Suscribirse', en: 'Subscribe' },
    'footer.sub_success': { es: '¡Suscrito!', en: 'Subscribed!' },
    
    // Common
    'common.loading': { es: 'Cargando...', en: 'Loading...' },
    'common.error': { es: 'Error', en: 'Error' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');
    const [currency, setCurrency] = useState<Currency>('COP');

    const toggleLanguage = () => {
        setLanguage(prev => {
            const newLang = prev === 'es' ? 'en' : 'es';
            setCurrency(newLang === 'es' ? 'COP' : 'USD');
            return newLang;
        });
    };

    const t = (key: string, defaultText: string = '') => {
        return translations[key]?.[language] || defaultText || key;
    };

    const formatPrice = (priceUSD: number) => {
        if (currency === 'USD') {
            return `$${priceUSD.toFixed(2)}`;
        } else {
            const priceCOP = priceUSD * 4000;
            return `$${priceCOP.toLocaleString('es-CO')}`;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, currency, toggleLanguage, t, formatPrice }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};