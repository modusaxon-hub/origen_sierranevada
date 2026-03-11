
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface LockedOverlayProps {
    title: string;
    message: string;
}

const LockedOverlay: React.FC<LockedOverlayProps> = ({ title, message }) => {
    const navigate = useNavigate();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md cursor-pointer"
            onClick={() => navigate('/')}
        >
            <div
                className="relative w-full max-w-lg bg-[#080A09]/90 border border-[#C8AA6E]/20 rounded-3xl p-12 text-center space-y-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-card-appear cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón de cierre (X) */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 right-6 text-white/30 hover:text-[#C8AA6E] transition-colors p-2"
                >
                    <span className="material-icons-outlined">close</span>
                </button>

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
                        className="w-full bg-[#C8AA6E] text-black py-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#D4B075] transition-all transform active:scale-[0.98] shadow-lg shadow-[#C8AA6E]/10 flex items-center justify-center gap-3"
                    >
                        Iniciar Sesión
                    </Link>
                    <Link
                        to="/register"
                        className="w-full border border-[#C8AA6E]/30 text-[#C8AA6E] py-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#C8AA6E]/10 transition-all flex items-center justify-center gap-3"
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
