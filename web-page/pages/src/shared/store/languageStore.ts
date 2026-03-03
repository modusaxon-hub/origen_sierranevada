import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'es' | 'en';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    formatPrice: (price: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
    es: {
        'nav.home': 'Inicio',
        'nav.subscription': 'Suscripciones',
        'nav.guide': 'Guía de Preparación',
        'nav.ai_lab': 'AI Lab',
        'cart.add': 'Añadir al carrito',
        // ... más traducciones
    },
    en: {
        'nav.home': 'Home',
        'nav.subscription': 'Subscriptions',
        'nav.guide': 'Brewing Guide',
        'nav.ai_lab': 'AI Lab',
        'cart.add': 'Add to cart',
        // ... más traducciones
    }
};

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'es',
            setLanguage: (lang) => set({ language: lang }),
            t: (key) => {
                const { language } = get();
                return translations[language][key] || key;
            },
            formatPrice: (price) => {
                return new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                }).format(price);
            }
        }),
        {
            name: 'language-storage',
        }
    )
);
