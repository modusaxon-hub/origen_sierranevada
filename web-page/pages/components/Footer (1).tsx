import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className="bg-surface-dark text-white pt-20 pb-10 border-t border-primary/30 relative overflow-hidden">
            {/* Background flourish */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                {/* Brand */}
                <div className="lg:col-span-1 text-center md:text-left">
                    <span className="font-accent text-xs tracking-[0.3em] text-primary mb-2 block">EST. 2023</span>
                    <h2 className="font-display text-2xl font-bold tracking-wider mb-6">ORIGEN<br/>SIERRA NEVADA</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Bringing the spirit of the mountain to your morning ritual. Sustainably grown, ethically sourced, and roasted to perfection.
                    </p>
                    <div className="flex justify-center md:justify-start space-x-6">
                        <a className="text-gray-400 hover:text-primary transition-colors transform hover:-translate-y-1" href="#"><i className="fa-brands fa-facebook text-xl"></i></a>
                        <a className="text-gray-400 hover:text-primary transition-colors transform hover:-translate-y-1" href="#"><i className="fa-brands fa-instagram text-xl"></i></a> 
                        <a className="text-gray-400 hover:text-primary transition-colors transform hover:-translate-y-1" href="#"><i className="fa-brands fa-twitter text-xl"></i></a>
                    </div>
                </div>

                {/* Navigation */}
                <div className="lg:col-span-1 text-center md:text-left">
                    <h3 className="font-accent font-bold text-sm text-white uppercase tracking-widest mb-6">{t('footer.explore')}</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#/" className="hover:text-primary transition-colors">{t('nav.home')}</a></li>
                        <li><a href="#/subscription" className="hover:text-primary transition-colors">{t('nav.sub')}</a></li>
                        <li><a href="#/guide" className="hover:text-primary transition-colors">{t('nav.guide')}</a></li>
                        <li><a href="#/ai-lab" className="hover:text-primary transition-colors">{t('nav.ai')}</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="md:col-span-2 lg:col-span-2">
                    <h3 className="font-accent font-bold text-sm text-white uppercase tracking-widest mb-6">{t('footer.join')}</h3>
                    <p className="text-gray-400 text-sm mb-6">{t('footer.desc')}</p>
                    
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('footer.enter_email')} 
                            className="flex-1 bg-white/5 border border-white/10 rounded px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                        <button 
                            type="submit"
                            className={`px-8 py-3 font-accent font-bold text-xs uppercase tracking-widest rounded transition-all duration-300 ${status === 'success' ? 'bg-green-600 text-white' : 'bg-primary hover:bg-primary-hover text-black'}`}
                        >
                            {status === 'success' ? t('footer.sub_success') : t('footer.sub_btn')}
                        </button>
                    </form>
                    <p className="text-xs text-gray-600 mt-4">* We respect your privacy. No spam, just coffee.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-gray-500 font-body">
                    <p>© 2023 Origen Sierra Nevada. {t('footer.rights')}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a className="hover:text-white transition-colors" href="#">{t('footer.privacy')}</a>
                        <a className="hover:text-white transition-colors" href="#">{t('footer.terms')}</a>
                        <a className="hover:text-white transition-colors" href="#">{t('footer.shipping')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
