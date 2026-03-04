import { useRef, useState, useEffect } from 'react';

/**
 * Observa si un elemento entra en el viewport.
 * Patrón extraído de BrandbookPage.tsx.
 */
export const useIntersectionObserver = (
    options?: IntersectionObserverInit
): [React.RefObject<HTMLElement>, boolean] => {
    const ref = useRef<HTMLElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            options
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []); // options omitidas intencionalmente — evitar re-runs por objetos literales

    return [ref, isIntersecting];
};
