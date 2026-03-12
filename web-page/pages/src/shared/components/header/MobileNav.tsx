import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/shared/components/Logo';
import TrackOrderModal from './TrackOrderModal';

interface MobileNavProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    onSearchOpen: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen, onSearchOpen }) => {
    const navigate = useNavigate();
    const { cartItems, setIsCartOpen } = useCart();
    const { language, toggleLanguage } = useLanguage();
    const [isTrackModalOpen, setIsTrackModalOpen] = React.useState(false);

    return (
        <div className="w-full lg:hidden flex flex-col bg-background-dark/95 backdrop-blur-md border-b border-white/10 shadow-xl overflow-hidden">
            {/* Single compact bar: Logo + Icons */}
            <div className="w-full flex justify-between items-center px-4 py-3">

                {/* Left: Logo + Menu + Search */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white hover:text-primary transition-colors p-2 mr-1"
                        aria-label="Toggle menu"
                    >
                        <span className="material-icons-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>

                    <Link to="/" className="hover:opacity-75 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo className="h-[30px] sm:h-[36px] w-auto" />
                    </Link>
                </div>

                {/* Right: Search + Track + Language + Cart */}
                <div className="flex items-center gap-1">
                    <button onClick={onSearchOpen} className="text-white hover:text-primary transition-colors p-2">
                        <span className="material-icons-outlined text-xl">search</span>
                    </button>
                    <button onClick={() => setIsTrackModalOpen(true)} className="text-white hover:text-primary transition-colors p-2 hidden sm:flex">
                        <span className="material-icons-outlined text-xl">radar</span>
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="text-white text-[10px] font-accent border border-white/10 rounded-full px-2 py-0.5 hover:border-primary hover:text-primary transition-colors hidden xs:flex"
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
            <TrackOrderModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} />
        </div>
    );
};

export default MobileNav;
