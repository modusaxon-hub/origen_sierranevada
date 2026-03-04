import { useState, useEffect } from 'react';

/**
 * Detecta si el usuario ha scrolleado más allá del threshold dado.
 * Patrón extraído de Header.tsx y Brandbook.tsx.
 */
export const useScrollDetect = (threshold = 20): boolean => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setIsScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, [threshold]);

    return isScrolled;
};
