import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FlavorProfile, CoffeeFormat } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const SubscriptionPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, formatPrice, language } = useLanguage();
    const [flavorId, setFlavorId] = useState('chocolate');
    const [formatId, setFormatId] = useState('wholebean');
    const [frequencyId, setFrequencyId] = useState('biweekly');
    const [showSuccess, setShowSuccess] = useState(false);

    const flavors: FlavorProfile[] = [
        { 
            id: 'chocolate', 
            title: language === 'es' ? 'Chocolate Negro y Nueces' : 'Dark Chocolate & Nuts', 
            desc: language === 'es' ? 'Tonos profundos y reconfortantes de cacao, almendras tostadas y caramelo.' : 'Deep, comforting tones of cacao, toasted almonds, and caramel.', 
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtKzJaQPx9f8PmDmCilO1DeDJrZYpF-ct6zIKPMyL1awczZUsOpTy1jOdZCSHcMOY6kE28iRAZvPaeO9gI3hoUmjYusIPNAK-FybrXmwEPJI281TXdirZ8-nfcwfjijphU5i87gDEAMqZxPZ65o0kmITM-2QuAMaIZ_A9-R-ISVH8uzFiRZ60ByxL9v-VEbjEXNrGUTFgHWJy1I7Fkh5I8gEYUZ-P_ol-O8ERH3I1okPyuVCO4hzqizvPJvgYnxySUy9Hd9plkvOwX' 
        },
        { 
            id: 'fruity', 
            title: language === 'es' ? 'Floral y Frutos Rojos' : 'Floral & Red Berries', 
            desc: language === 'es' ? 'Brillante y vivo con notas de jazmín, fresas silvestres y ralladura de cítricos.' : 'Bright and lively with hints of jasmine, wild strawberries, and citrus zest.', 
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGpvAGMakntpimb1DZDp8_vel0YXIjSIicXSmM743lT-YmHWrls1Ioit-6X5VG-bqv8WtLTZ98nyj6cOhXgnbN2RYqnyfFTdFcR60hFxsih-uOoZHDrJ1tM0GMXH9T1SOwJg1mimtL4Xc3ucbaH44egDFRVEHu2L_hfnWYHtL-fkQuFm4XIr6v1YxkbOScsEvxN5PHPgBiH-NEarB7KpBcrP7va90x0GRyAT_pgBgCJYHDlnLhnIPMU09ieYiPVjyB5es_mEa9j8ri' 
        }
    ];

    const formats: CoffeeFormat[] = [
        { 
            id: 'wholebean', 
            title: language === 'es' ? 'Grano Entero' : 'Whole Bean', 
            desc: language === 'es' ? 'Máxima frescura' : 'Maximum freshness', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJx8Et4HVW3XszhYo2FMkfFtOFIikw5gNxHBy11rrl6So9Tiz17P_1j6_81lwG1TcisB43pMoLHGfncypIsxoSVTUdOTG9xr2EmyREOu23Io9BXcUCVk4VRNGtBLaWbXN7NYuquxxMNaQcEJ0eyAZssyKP2qqjM5yp5W6Hb4UxE_ExQOMbIEvtlyA45QZD5xQ0xx2m8-8D-3-R1gP_KYteT2rCrjyvTabkI-VnThwWfet9o1ddOl31NV26NQmcgHfzjpG6bMvrvf2s' 
        },
        { 
            id: 'ground', 
            title: language === 'es' ? 'Molido' : 'Ground', 
            desc: language === 'es' ? 'Perfecto para goteo' : 'Perfect for drip', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2bY8lFrg2cg3H258mcqZHKtLGC1tTrXRMOcs2mnvRTEfdFIOjmi1qeqakfduZiGQom7VukTsD3ALlTANQljj-onP0bxnSiYK4JVMcyyDYP8nNIbMLOiZ0jcSWuR44K6dk4VcDWWvlqSKQNtdfPbd_Y3HbMdNseqMbXySVVndr-ZG5N_8zLjLM0uSAOAftQZCntXV0GndxxlJqIYrVn9MrRZQzu0_ifFSCh4Bd3GbJhMR3aV1150ha42M9HBNyUeWbd0rSkMsmy6Lv' 
        },
        { 
            id: 'capsules', 
            title: language === 'es' ? 'Eco Cápsulas' : 'Eco Capsules', 
            desc: language === 'es' ? 'Compatible Nespresso®' : 'Nespresso® Compatible', 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-6scBBpQeR9q5CRlRJUac3X4Yni9tAmZKpgVY4by95o9sKATtPjIUozMp2smlDnmlsCeo0rGq7a3o5wkijfGmBaGLVceWE15q5IAtSnuG2T0Rc0V7G1pa7b4FuXzSinSOJXb2nRzPq18vIKb7QkaORrIgY9fn_dKxibuqe14bCelel4ymxQ2DjWBUUdeWko23ZKylI8_jZp-sgCY6nKJdFevE8oVmZJf4YjU_lmVhtxSHLvvfZdy8X_nBvHujd0QO7UK6pzjUez0f' 
        }
    ];

    const frequencies = [
        { id: 'weekly', title: t('sub.freq.weekly'), desc: t('sub.freq.weekly_desc') },
        { id: 'biweekly', title: t('sub.freq.biweekly'), desc: t('sub.freq.biweekly_desc') },
        { id: 'monthly', title: t('sub.freq.monthly'), desc: t('sub.freq.monthly_desc') },
    ];

    const selectedFlavor = flavors.find(f => f.id === flavorId) || flavors[0];
    const selectedFormat = formats.find(f => f.id === formatId) || formats[0];
    const selectedFrequency = frequencies.find(f => f.id === frequencyId) || frequencies[1];

    const handleSubscribe = () => {
        setShowSuccess(true);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 relative">
            
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSuccess(false)}></div>
                    <div className="bg-surface-light dark:bg-surface-dark p-8 md:p-12 rounded-lg shadow-2xl relative z-10 max-w-lg w-full text-center border border-primary/20 animate-float">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons-outlined text-4xl text-green-500">check</span>
                        </div>
                        <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('sub.modal_title')}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            {t('sub.modal_desc')}
                        </p>
                        <div className="bg-background-light dark:bg-black/20 p-4 rounded mb-8 text-left text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">{t('sub.step.3')}:</span>
                                <span className="font-bold dark:text-white">{selectedFrequency.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('sub.next_ship')}:</span>
                                <span className="font-bold dark:text-white">Oct 28, 2023</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setShowSuccess(false); navigate('/'); }}
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded uppercase tracking-widest w-full transition-colors"
                        >
                            {t('sub.modal_return')}
                        </button>
                    </div>
                </div>
            )}

            <div className="pt-32 pb-16 text-center px-4 relative">
                 <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
                    <img alt="Sierra Nevada Mountains" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLAqP7g-Ab101rA1carCS5LuycVStXSH47IZPy6ecdhKeG7sItcjqo7-tacKn_U-oIFQUjBbPoDeQWaMswZsDyVjU6VqaZyCg-mxg8Mrj1vg9dWDkbsmNoOyMam7lIeHnCM--ybM8bg9SgSGUfnSqLCd40oxH6_zVxTJvWUhdAiksKlcZVr_tt1INCvt9Q5RPX2CYjRNR6pYIkOQ3FsWfSp_fl31PtBn5aba2ypbUSgZOyfAaSkxoEAqw0-_rgHSHjNKOQlkxd5kPS"/>
                </div>
                <div className="relative z-10">
                    <span className="block text-primary font-display tracking-[0.2em] text-sm mb-4 uppercase">{t('sub.hero_sub')}</span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-gray-900 dark:text-white mb-6">{t('sub.hero_title')}</h1>
                </div>
            </div>

            {/* Stepper */}
            <div className="max-w-5xl mx-auto px-4 mb-12">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>
                    {[t('sub.step.1'), t('sub.step.2'), t('sub.step.3'), t('sub.step.4')].map((step, idx) => (
                        <div key={step} className="flex flex-col items-center bg-background-light dark:bg-background-dark px-2">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold shadow-lg transition-colors ${idx === 0 ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                                {idx + 1}
                            </div>
                            <span className="mt-3 text-xs font-bold tracking-widest text-primary uppercase">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4">
                {/* Flavor */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display text-center text-gray-900 dark:text-white mb-2">{t('sub.flavor_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {flavors.map(f => (
                            <div 
                                key={f.id} 
                                onClick={() => setFlavorId(f.id)}
                                className={`cursor-pointer h-full p-8 border rounded-sm flex flex-col items-center text-center relative overflow-hidden transition-all ${flavorId === f.id ? 'border-primary bg-primary/5 dark:bg-surface-dark' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50'}`}
                            >
                                {flavorId === f.id && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-icons-outlined text-sm">check</span></div>}
                                <div className="w-24 h-24 mb-6 rounded-full bg-amber-900/10 flex items-center justify-center">
                                    <img src={f.icon} className="w-14 h-14 opacity-80 filter sepia brightness-50 contrast-125" />
                                </div>
                                <h3 className="text-xl font-display text-gray-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Format */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display text-center text-gray-900 dark:text-white mb-10">{t('sub.format_title')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {formats.map(fmt => (
                            <div 
                                key={fmt.id} 
                                onClick={() => setFormatId(fmt.id)}
                                className={`cursor-pointer p-6 border rounded-sm flex flex-col items-center text-center relative transition-all ${formatId === fmt.id ? 'border-primary bg-primary/5 dark:bg-surface-dark' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50'}`}
                            >
                                {formatId === fmt.id && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-icons-outlined text-[10px]">check</span></div>}
                                <img src={fmt.img} className="w-full h-32 object-cover mb-4 rounded-sm filter sepia-[.2] contrast-125 brightness-90" />
                                <h3 className="font-display text-lg text-gray-900 dark:text-white">{fmt.title}</h3>
                                <p className="text-xs text-gray-500 mt-2">{fmt.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Frequency */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display text-center text-gray-900 dark:text-white mb-10">{t('sub.frequency_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {frequencies.map(freq => (
                            <div 
                                key={freq.id} 
                                onClick={() => setFrequencyId(freq.id)}
                                className={`cursor-pointer p-8 border rounded-sm flex flex-col items-center text-center relative transition-all ${frequencyId === freq.id ? 'border-primary bg-primary/5 dark:bg-surface-dark' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50'}`}
                            >
                                {frequencyId === freq.id && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-icons-outlined text-[10px]">check</span></div>}
                                <span className={`material-icons-outlined text-4xl mb-4 ${frequencyId === freq.id ? 'text-primary' : 'text-gray-400'}`}>
                                    {freq.id === 'weekly' ? 'looks_one' : freq.id === 'biweekly' ? 'looks_two' : 'calendar_today'}
                                </span>
                                <h3 className="font-display text-lg text-gray-900 dark:text-white">{freq.title}</h3>
                                <p className="text-xs text-gray-500 mt-2">{freq.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Summary Block */}
                <section className="bg-white dark:bg-surface-dark border-t-4 border-primary p-8 md:p-12 shadow-2xl relative overflow-hidden rounded-sm">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                        <div className="mb-8 md:mb-0 text-center md:text-left">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">{t('sub.your_selection')}</span>
                            <h3 className="text-2xl md:text-3xl font-display text-gray-900 dark:text-white mb-2">Sierra Nevada Signature Blend</h3>
                            <p className="text-gray-500 dark:text-gray-400 capitalize">
                                {selectedFlavor.title} • {selectedFormat.title} • {selectedFrequency.title}
                            </p>
                        </div>
                        <div className="text-center md:text-right flex flex-col items-center md:items-end">
                            <div className="flex items-baseline mb-4">
                                <span className="text-sm text-gray-500 line-through mr-3">{formatPrice(24.00)}</span>
                                <span className="text-4xl font-display font-bold text-gray-900 dark:text-white">{formatPrice(21.60)}</span>
                                <span className="text-sm text-gray-500 ml-1">{t('sub.shipment')}</span>
                            </div>
                            <button 
                                onClick={handleSubscribe}
                                className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-10 rounded-sm shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                            >
                                <span>{t('sub.start_btn')}</span>
                                <span className="material-icons-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SubscriptionPage;
