import { useState, useEffect } from 'react';

/**
 * Estado sincronizado con localStorage.
 * Patrón extraído de CartContext.tsx y CookieBanner.tsx.
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (val: T) => void] => {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Silent fail — entornos sin localStorage (SSR, private mode)
        }
    }, [key, value]);

    return [value, setValue];
};
