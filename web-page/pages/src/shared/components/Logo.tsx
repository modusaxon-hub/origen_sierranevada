import React from 'react';
import logoUrl from '@assets/logo/svg/origen-logo-completo.svg';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className="relative animate-logo-entrance">
            <img
                src={logoUrl}
                alt="Origen Sierra Nevada"
                className={`${className} relative z-10`}
                loading="eager"
            />
        </div>
    );
};

export default Logo;

