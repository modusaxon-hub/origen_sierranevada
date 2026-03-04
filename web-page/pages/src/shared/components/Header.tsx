import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNav from './header/MobileNav';
import DesktopNav from './header/DesktopNav';
import MobileMenuDrawer from './header/MobileMenuDrawer';
import CartDrawer from './header/CartDrawer';
import SearchOverlay from './header/SearchOverlay';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close overlays on route change
    useEffect(() => {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
    }, [navigate]);

    return (
        <>
            <nav className={`fixed w-full z-50 top-0 transition-all duration-700 flex flex-col items-center ${isScrolled
                ? 'bg-[#141E16]/70 backdrop-blur-2xl shadow-2xl shadow-[#C8AA6E]/10 border-b border-[#C8AA6E]/30'
                : 'bg-gradient-to-b from-[#141E16]/50 to-transparent backdrop-blur-lg border-b border-[#C8AA6E]/10'
            }`}>
                <MobileNav
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onSearchOpen={() => setIsSearchOpen(true)}
                />
                <DesktopNav onSearchOpen={() => setIsSearchOpen(true)} />
            </nav>

            <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <CartDrawer />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Header;
