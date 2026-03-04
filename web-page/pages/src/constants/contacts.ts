/**
 * CONTACTS — Constantes centralizadas de contacto
 * Usar en lugar de hardcoding en múltiples lugares
 */

export const CONTACTS = {
    whatsapp: {
        number: '+573107405154', // Origen Sierra Nevada WhatsApp Business
        baseUrl: 'https://wa.me',
    },
    email: {
        support: 'origensierranevadasm@gmail.com',
        admin: 'origensierranevadasm@gmail.com',
        comercial: 'origensierranevadasm@gmail.com',
    },
};

/**
 * Genera un link wa.me con mensaje pre-llenado
 * @param message - Mensaje a incluir (URL encoded automáticamente)
 * @returns URL completa wa.me
 */
export const getWhatsAppLink = (message?: string): string => {
    const baseLink = `${CONTACTS.whatsapp.baseUrl}/${CONTACTS.whatsapp.number}`;
    if (!message) return baseLink;
    const encoded = encodeURIComponent(message);
    return `${baseLink}?text=${encoded}`;
};

/**
 * Genera mensajes pre-llenados según contexto
 * @param context - 'order' | 'support' | 'info'
 * @param orderId - ID de orden (opcional, para contexto 'order')
 * @returns Mensaje listo para usar
 */
export const getWhatsAppMessage = (
    context: 'order' | 'support' | 'info',
    orderId?: string
): string => {
    const messages: Record<string, string> = {
        order: orderId
            ? `Hola, quiero confirmar mi pedido #${orderId.slice(0, 8).toUpperCase()} enviando comprobante de pago.`
            : `Hola, quiero confirmar mi pedido enviando comprobante de pago.`,
        support: `Hola, necesito ayuda con mi cuenta de Origen Sierra Nevada.`,
        info: `Hola, quiero conocer más sobre los productos de Origen Sierra Nevada.`,
    };
    return messages[context] || messages.info;
};

/**
 * Genera URL completa con contexto (message + link)
 */
export const getWhatsAppLinkWithContext = (
    context: 'order' | 'support' | 'info',
    orderId?: string
): string => {
    const message = getWhatsAppMessage(context, orderId);
    return getWhatsAppLink(message);
};
