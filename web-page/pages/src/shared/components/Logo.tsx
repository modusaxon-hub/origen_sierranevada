import React from 'react';
import OrigenLogo from '@assets/logo/svg/origen-logo-completo.svg?react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className="relative animate-logo-entrance">
            <OrigenLogo
                className={`${className} relative z-10`}
                role="img"
                aria-label="Origen Sierra Nevada"
            />
        </div>
    );
};

export default Logo;

