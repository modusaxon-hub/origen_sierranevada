
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface LockedOverlayProps {
    title: string;
    message: string;
}

const LockedOverlay: React.FC<LockedOverlayProps> = ({ title, message }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#080A09]/90 border border-[#C8AA6E]/20 rounded-3xl p-12 text-center space-y-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-card-appear">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[#C8AA6E]/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-full border border-[#C8AA6E]/40 flex items-center justify-center bg-black/60 shadow-inner">
                        <span className="material-icons-outlined text-[#C8AA6E] text-4xl">lock</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic tracking-tight">{title}</h2>
                    <p className="text-white/50 text-sm md:text-base font-light italic leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/login"
                        className="w-full bg-[#C8AA6E] text-black py-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#D4B075] transition-all transform active:scale-[0.98] shadow-lg shadow-[#C8AA6E]/10"
                    >
                        Iniciar Sesión
                    </Link>
                    <Link
                        to="/register"
                        className="w-full border border-white/10 text-white/40 py-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:text-white hover:border-white/30 transition-all"
                    >
                        Crear Cuenta
                    </Link>
                </div>

                <div className="pt-4 opacity-30">
                    <Logo className="w-32 h-auto mx-auto grayscale" />
                </div>
            </div>
        </div>
    );
};

export default LockedOverlay;
