import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/shared/components/Logo';

interface MobileNavProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    onSearchOpen: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen, onSearchOpen }) => {
    const navigate = useNavigate();
    const { cartItems, setIsCartOpen } = useCart();
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="w-full lg:hidden flex flex-col bg-background-dark/95 backdrop-blur-md border-b border-white/10 shadow-xl overflow-hidden">
            {/* Tier 1: Logo Throne (Centered) */}
            <Link
                to="/"
                className="w-full flex justify-center py-8 border-b border-[#C8AA6E]/20 cursor-pointer hover:bg-[#C8AA6E]/5 transition-all duration-500 active:scale-95"
            >
                <Logo className="h-[34px] sm:h-[46px] md:h-[56px] w-auto object-contain" />
            </Link>

            {/* Tier 2: Icons & Actions */}
            <div className="w-full flex justify-between items-center px-4 py-2 bg-white/[0.02]">
                {/* Left: Menu & Search */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white hover:text-primary transition-colors p-2"
                    >
                        <span className="material-icons-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                    <button onClick={onSearchOpen} className="text-white hover:text-primary transition-colors p-2">
                        <span className="material-icons-outlined text-xl">search</span>
                    </button>
                </div>

                {/* Right: Language & Cart */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleLanguage}
                        className="text-white text-[10px] font-accent border border-white/10 rounded-full px-2.5 py-1 hover:border-primary hover:text-primary transition-colors mr-1"
                    >
                        {language.toUpperCase()}
                    </button>
                    <div
                        className="relative cursor-pointer text-white hover:text-primary transition-colors p-2"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <span className="material-icons-outlined text-2xl">shopping_bag</span>
                        {cartItems.length > 0 && (
                            <span className="absolute top-1 right-1 bg-primary text-background-dark text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-black">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
