import React from 'react';
import logoUrl from '@assets/logo/svg/origen-logo-completo.svg';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <img
            src={logoUrl}
            alt="Origen Sierra Nevada"
            className={className}
            loading="eager"
        />
    );
};

export default Logo;

