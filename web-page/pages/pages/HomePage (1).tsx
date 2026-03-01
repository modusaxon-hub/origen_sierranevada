import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { t, formatPrice } = useLanguage();
    const [purchaseType, setPurchaseType] = useState('subscribe');

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            {/* Hero Section Inmersivo "La Firma de la Tierra" */}
            <header className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Misty Sierra Nevada Mountains"
                        className="w-full h-full object-cover opacity-80 dark:opacity-60 filter brightness-50"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcfAtXK3rO0DtljnnG98PWskBu0QIToFPcvB-G_wdSE1gYPoRefQj9wBEQwIF1hyVZEJIeb9EX1GyHYkuUrgDl3yDsLWABFaFGrYkdWG0MuXBAnm-uy7guEIXcwo1KUzQBE78bHQOH32lkwEQYosLe-sT-OvYBvUKE9XCyXSRjb-jsEVJAc4qcVT6dcVDtct1NHtwEezMsCd_rOzArG4Nd6VvlZ6HsfdzvFmMQ728789xZkrYQn6BZWo_kNRNpp5E6D5h2tQv6Lqep"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background-dark/60 via-transparent to-background-light dark:to-background-dark h-full"></div>
                </div>

                <div className="relative z-10 text-center px-4 mt-16 max-w-4xl mx-auto">
                    <h2 className="font-accent text-primary text-sm sm:text-base tracking-[0.4em] mb-4 uppercase animate-fade-up">
                        {t('home.hero.badge')}
                    </h2>
                    <h1 className="font-display text-white text-5xl sm:text-7xl lg:text-8xl mb-6 tracking-wide drop-shadow-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        LA FIRMA DE LA <span className="text-primary italic">TIERRA</span>
                    </h1>
                    <p className="font-body text-gray-200 text-lg sm:text-xl tracking-widest uppercase mb-12 animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
                        {t('home.desc')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="bg-primary hover:bg-primary-hover text-background-dark font-display font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 border border-primary transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(200,170,110,0.3)]"
                        >
                            {t('home.add_cart')}
                        </button>
                        <button
                            onClick={() => navigate('/guide')}
                            className="bg-transparent hover:bg-white/10 text-white font-display font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 border border-white/30 hover:border-white transition-all duration-300 backdrop-blur-sm"
                        >
                            {t('home.learn_more')}
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <span className="material-icons-outlined text-white/50 text-3xl">keyboard_arrow_down</span>
                </div>
            </header>

            {/* Story Section */}
            <section className="py-24 bg-surface-light dark:bg-surface-dark relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
                    <h2 className="font-display text-4xl lg:text-5xl text-gray-900 dark:text-white mb-10">{t('home.story_title')}</h2>
                    <div className="relative">
                        <span className="absolute -top-12 -left-8 font-display text-9xl text-primary/10 select-none z-0">“</span>
                        <p className="font-display italic text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-loose relative z-10">
                            {t('home.story_desc')}
                        </p>
                        <span className="absolute -bottom-24 -right-4 font-display text-9xl text-primary/10 select-none z-0 rotate-180">”</span>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                                <span className="material-icons-outlined text-3xl">landscape</span>
                            </div>
                            <h3 className="font-accent font-bold text-sm uppercase tracking-widest mb-2 dark:text-white">{t('home.high_alt')}</h3>
                            <p className="text-xs text-gray-500">{t('home.high_alt_sub')}</p>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                                <span className="material-icons-outlined text-3xl">water_drop</span>
                            </div>
                            <h3 className="font-accent font-bold text-sm uppercase tracking-widest mb-2 dark:text-white">{t('home.washed')}</h3>
                            <p className="text-xs text-gray-500">{t('home.washed_sub')}</p>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                                <span className="material-icons-outlined text-3xl">eco</span>
                            </div>
                            <h3 className="font-accent font-bold text-sm uppercase tracking-widest mb-2 dark:text-white">{t('home.sustainable')}</h3>
                            <p className="text-xs text-gray-500">{t('home.sustainable_sub')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Traceability Section */}
            <section className="py-24 bg-background-light dark:bg-background-dark relative border-t border-primary/20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-4">
                            <h2 className="font-display text-4xl text-gray-900 dark:text-white mb-6">{t('home.trace_title')}</h2>
                            <p className="font-body text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                                {t('home.trace_desc')}
                            </p>
                            <img alt="Coffee Map" className="w-full rounded-lg opacity-80 filter sepia grayscale hover:grayscale-0 transition-all duration-500 shadow-xl border border-gray-200 dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO5Q1YykryEvYoIHTpXI7jpv2OrcvGw4-J2vABWKMo6aSE5H6muzX7eBmpkE36f9yXBODbF-85LO2AbBB-Qw1iyOgWtjOK0FW16Vfo5uN0xWn8tHSAms_Rb-MoSZM3-hhX1P6ijvYh6JPtbLlSAYOtLJpnVmrDePvopUPIqzfc7eiuP4J40jxnUxVUMNHE3wTfDrmapj3Ko9msvwaPD2RrUw4oz10YE_Y1CMSv8clYJvxmzwjzM76zDzliifEFBbrVkardtyl1B1Wn" />
                        </div>
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-primary/20 bg-surface-light dark:bg-surface-dark shadow-2xl">
                                <div className="p-8 border-b md:border-b-0 md:border-r border-primary/20 hover:bg-primary/5 transition-colors">
                                    <h4 className="font-accent text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('home.producer')}</h4>
                                    <p className="font-display text-2xl text-gray-900 dark:text-white">Luis Rodriguez</p>
                                </div>
                                <div className="p-8 border-b border-primary/20 hover:bg-primary/5 transition-colors">
                                    <h4 className="font-accent text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('home.region')}</h4>
                                    <p className="font-display text-2xl text-gray-900 dark:text-white">Minca, Sierra Nevada</p>
                                </div>
                                <div className="p-8 border-b md:border-b-0 md:border-r border-primary/20 hover:bg-primary/5 transition-colors">
                                    <h4 className="font-accent text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('home.altitude')}</h4>
                                    <p className="font-display text-2xl text-gray-900 dark:text-white">1,850 MASL</p>
                                </div>
                                <div className="p-8 border-b border-primary/20 hover:bg-primary/5 transition-colors">
                                    <h4 className="font-accent text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('home.roast_date')}</h4>
                                    <p className="font-display text-2xl text-gray-900 dark:text-white">Oct 24, 2023</p>
                                </div>
                                <div className="p-8 md:col-span-2 hover:bg-primary/5 transition-colors">
                                    <h4 className="font-accent text-xs font-bold text-primary uppercase tracking-widest mb-2">{t('home.variety')}</h4>
                                    <p className="font-display text-2xl text-gray-900 dark:text-white">Castillo, Caturra</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default HomePage;