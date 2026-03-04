import { useRef, useEffect } from 'react';

/**
 * Llama callback cuando el usuario hace clic fuera del elemento referenciado.
 * Patrón ref-based (más robusto que class-selector).
 * Ver MEMORY.md — Custom Hooks Pattern: useOutsideClick
 */
export const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [callback]);

    return ref;
};
