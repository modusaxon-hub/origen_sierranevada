/**
 * Sanitiza texto para prevenir inyección de HTML/JavaScript
 * Remueve caracteres peligrosos y limita longitud
 *
 * @param input - String a sanitizar
 * @returns String sanitizado
 */
export const sanitizeText = (input: string): string => {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/[<>"'`\\]/g, '') // Quita caracteres HTML/JS
        .trim()
        .slice(0, 500); // Limita a 500 caracteres
};

/**
 * Sanitiza email (básico)
 * @param email - Email a validar
 * @returns true si el email es válido, false si no
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Sanitiza teléfono (solo números y caracteres básicos)
 * @param phone - Teléfono a sanitizar
 * @returns String sanitizado
 */
export const sanitizePhone = (input: string): string => {
    return input.replace(/[^0-9\s+()-]/g, '').trim().slice(0, 20);
};
