import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const searchResults: any[] = [];

    return (
        <div className={`fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-xl transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div className="max-w-4xl mx-auto px-6 pt-32 h-full flex flex-col">
                <div className="relative border-b-2 border-primary/50 focus-within:border-primary transition-colors">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
                        <span className="material-icons-outlined text-3xl">search</span>
                    </span>
                    <input
                        autoFocus={isOpen}
                        type="text"
                        placeholder={t('nav.search_placeholder')}
                        className="w-full bg-transparent border-none text-4xl font-display text-white placeholder-gray-600 pl-14 py-6 focus:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={() => { onClose(); setSearchQuery(''); }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2"
                    >
                        <span className="material-icons-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="mt-12 overflow-y-auto">
                    {searchQuery && (
                        <div className="space-y-2">
                            <p className="text-primary font-accent text-xs tracking-widest uppercase mb-6">{t('nav.search_results')}</p>
                            {searchResults.length > 0 ? (
                                searchResults.map((result, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => { navigate(result.path); onClose(); }}
                                        className="group flex items-center justify-between p-4 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all animate-fade-in"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`material-icons-outlined ${result.type === 'Tool' ? 'text-primary' : 'text-gray-500'}`}>
                                                {result.type === 'Page' ? 'article' : result.type === 'Tool' ? 'smart_toy' : 'local_cafe'}
                                            </span>
                                            <span className="text-xl text-gray-300 group-hover:text-white font-display">{result.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-600 group-hover:text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{t('nav.jump')}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">{t('nav.no_results')} "{searchQuery}"</p>
                            )}
                        </div>
                    )}
                    {!searchQuery && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
                            {['Pour Over', 'Beans', 'Espresso', 'AI Tools'].map(tag => (
                                <button key={tag} onClick={() => setSearchQuery(tag)} className="p-4 border border-white/10 rounded hover:bg-white/5 text-gray-400 hover:text-primary transition-colors text-left">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
