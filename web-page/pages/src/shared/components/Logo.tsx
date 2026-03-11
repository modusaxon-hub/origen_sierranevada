import React from 'react';
import { Link } from 'react-router-dom';
import OrigenLogo from '@assets/logo/svg/origen-logo-completo.svg';

interface LogoProps {
    className?: string;
    to?: string;
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className, to = "/", onClick }) => {
    return (
        <Link
            to={to}
            className={`relative block transition-transform active:scale-95 group/logo ${className}`}
            onClick={onClick}
        >
            <div className="relative animate-logo-entrance">
                <img
                    src={OrigenLogo}
                    className="w-full h-auto relative z-10 filter-gold"
                    alt="Origen Sierra Nevada"
                />
            </div>
        </Link>
    );
};

export default Logo;

