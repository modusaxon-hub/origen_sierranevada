import React, { useState } from 'react';
import Footer from '../components/Footer';
import { CoffeeMethod } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const BrewingGuidePage: React.FC = () => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState('v60');

    // Define methods with dynamic language support
    const methods: Record<string, CoffeeMethod> = {
        french: { 
            title: 'French Press', 
            time: '4:00 min', 
            texture: language === 'es' ? 'Sal Marina Gruesa' : 'Coarse Sea Salt', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZv5nOjp7zmCZWGky4raehhN3mKOLVPfk7eSBc9HNBjO5_kEG1uLCwIfoV2zizjbqLyiS1aAl43qdi4ZMZ3OVO59JxWHZp6TgX6Sw11WEvi_-nzkn5hoEVagZgtxAfYnZgN-h8LhD3zDWvYUSqSYDSFQCQSutsQeJpn7hZcVzpF1vXFP9OjLupDWW_HSc7b0YfZAOUNk9jSQA6kohzyMdBLFhCICbYLZlzToOGgmQZufO0hnnEcHt2CHFGM_tqMBUlTY4q109L_afn', 
            desc: language === 'es' ? 'La inmersión completa permite un cuerpo pesado y un perfil de sabor rico.' : 'Full immersion brewing allows for a heavy body and rich flavor profile.' 
        },
        v60: { 
            title: 'V60 Pour Over', 
            time: '2:30 - 3:00 min', 
            texture: language === 'es' ? 'Sal Kosher' : 'Kosher Salt', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZv5nOjp7zmCZWGky4raehhN3mKOLVPfk7eSBc9HNBjO5_kEG1uLCwIfoV2zizjbqLyiS1aAl43qdi4ZMZ3OVO59JxWHZp6TgX6Sw11WEvi_-nzkn5hoEVagZgtxAfYnZgN-h8LhD3zDWvYUSqSYDSFQCQSutsQeJpn7hZcVzpF1vXFP9OjLupDWW_HSc7b0YfZAOUNk9jSQA6kohzyMdBLFhCICbYLZlzToOGgmQZufO0hnnEcHt2CHFGM_tqMBUlTY4q109L_afn', 
            desc: language === 'es' ? 'Para un V60, buscas una textura similar a la sal marina. Limpio, brillante y resalta la acidez.' : 'For a V60 pour over, you are looking for a texture similar to Sea Salt. Bright, clean, and highlights acidity.' 
        },
        aero: { 
            title: 'AeroPress', 
            time: '1:30 min', 
            texture: language === 'es' ? 'Sal de Mesa' : 'Table Salt', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZv5nOjp7zmCZWGky4raehhN3mKOLVPfk7eSBc9HNBjO5_kEG1uLCwIfoV2zizjbqLyiS1aAl43qdi4ZMZ3OVO59JxWHZp6TgX6Sw11WEvi_-nzkn5hoEVagZgtxAfYnZgN-h8LhD3zDWvYUSqSYDSFQCQSutsQeJpn7hZcVzpF1vXFP9OjLupDWW_HSc7b0YfZAOUNk9jSQA6kohzyMdBLFhCICbYLZlzToOGgmQZufO0hnnEcHt2CHFGM_tqMBUlTY4q109L_afn', 
            desc: language === 'es' ? 'Versátil y tolerante. Produce una taza entre goteo y espresso.' : 'Versatile and forgiving. Produces a cup somewhere between drip and espresso.' 
        },
        espresso: { 
            title: 'Espresso', 
            time: '25-30 sec', 
            texture: language === 'es' ? 'Harina Fina' : 'Fine Flour', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZv5nOjp7zmCZWGky4raehhN3mKOLVPfk7eSBc9HNBjO5_kEG1uLCwIfoV2zizjbqLyiS1aAl43qdi4ZMZ3OVO59JxWHZp6TgX6Sw11WEvi_-nzkn5hoEVagZgtxAfYnZgN-h8LhD3zDWvYUSqSYDSFQCQSutsQeJpn7hZcVzpF1vXFP9OjLupDWW_HSc7b0YfZAOUNk9jSQA6kohzyMdBLFhCICbYLZlzToOGgmQZufO0hnnEcHt2CHFGM_tqMBUlTY4q109L_afn', 
            desc: language === 'es' ? 'Extracción a alta presión creando un shot concentrado y almibarado con crema.' : 'High pressure extraction creating a concentrated, syrupy shot with crema.' 
        }
    };

    const current = methods[activeTab];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-mountain-pattern bg-cover bg-center bg-fixed"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background-light dark:to-background-dark"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center mb-6 bg-black/30 backdrop-blur-sm">
                            <i className="fa-solid fa-mortar-pestle text-primary text-2xl"></i>
                        </div>
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl text-white mb-4 tracking-wide text-shadow">{t('brew.hero_title')}</h2>
                    <p className="font-body text-gray-200 text-lg md:text-xl tracking-widest uppercase mb-8 opacity-90">{t('brew.hero_sub')}</p>
                    <div className="w-24 h-0.5 bg-primary mx-auto"></div>
                </div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-primary">
                    <i className="fa-solid fa-chevron-down text-2xl"></i>
                </div>
            </header>

            <section className="relative py-24 px-6 md:px-12 lg:px-24">
                <div className="text-center mb-16">
                    <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">{t('brew.interactive')}</span>
                    <h3 className="font-display text-3xl md:text-5xl text-gray-900 dark:text-white mb-6">{t('brew.selector')}</h3>
                </div>

                <div className="max-w-6xl mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    {/* Tabs */}
                    <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-800">
                        {Object.keys(methods).map(key => (
                            <button 
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex-1 py-6 px-4 flex flex-col items-center justify-center gap-3 transition-colors group border-b-2 ${activeTab === key ? 'bg-primary/5 dark:bg-primary/10 border-primary' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                                <i className={`fa-solid ${key === 'french' ? 'fa-mug-hot' : key === 'v60' ? 'fa-filter' : key === 'aero' ? 'fa-syringe' : 'fa-mug-saucer'} text-2xl ${activeTab === key ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}></i>
                                <span className={`text-xs uppercase tracking-widest font-bold ${activeTab === key ? 'text-primary' : 'text-gray-500 group-hover:text-primary dark:text-gray-400'}`}>{methods[key].title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 fade-in">
                        <div className="w-full md:w-1/2 space-y-6">
                            <div>
                                <h4 className="font-display text-2xl text-gray-900 dark:text-white mb-2">{current.title}</h4>
                                <div className="h-1 w-12 bg-primary"></div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">{current.desc}</p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="bg-background-light dark:bg-background-dark p-4 rounded border border-gray-100 dark:border-gray-800">
                                    <span className="block text-xs text-primary uppercase tracking-wider mb-1">{t('brew.time')}</span>
                                    <span className="font-display text-lg dark:text-white">{current.time}</span>
                                </div>
                                <div className="bg-background-light dark:bg-background-dark p-4 rounded border border-gray-100 dark:border-gray-800">
                                    <span className="block text-xs text-primary uppercase tracking-wider mb-1">{t('brew.texture')}</span>
                                    <span className="font-display text-lg dark:text-white">{current.texture}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 relative">
                            <div className="relative overflow-hidden rounded-lg shadow-xl aspect-video md:aspect-square">
                                <img src={current.img} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default BrewingGuidePage;
