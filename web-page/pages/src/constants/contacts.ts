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

/**
 * Interface para detalles completos de orden (F3-004)
 */
export interface OrderWhatsAppDetail {
    orderId: string;
    customerName: string;
    customerPhone: string;
    address: string;
    city: string;
    department: string;
    items: Array<{
        name: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }>;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    proofUrl?: string;
}

/**
 * Genera mensaje detallado de WhatsApp con lista completa de productos y datos de envío
 * Utilizado para notificar al admin cuando cliente sube comprobante de pago
 */
export const getWhatsAppOrderDetailMessage = (detail: OrderWhatsAppDetail): string => {
    const ref = detail.orderId.slice(0, 8).toUpperCase();
    const itemLines = detail.items
        .map(i => `• ${i.quantity}x ${i.name} — $${i.unitPrice.toLocaleString('es-CO')} = $${i.subtotal.toLocaleString('es-CO')}`)
        .join('\n');

    return [
        `*COMPROBANTE DE PAGO — ORIGEN SIERRA NEVADA*`,
        `Pedido: #${ref}`,
        ``,
        `*PRODUCTOS:*`,
        itemLines,
        ``,
        `Subtotal: $${detail.subtotal.toLocaleString('es-CO')}`,
        detail.discount > 0 ? `Descuento: -$${detail.discount.toLocaleString('es-CO')}` : null,
        `Envío: ${detail.shipping === 0 ? 'GRATIS' : '$' + detail.shipping.toLocaleString('es-CO')}`,
        `*TOTAL: $${detail.total.toLocaleString('es-CO')} COP*`,
        ``,
        `*ENVÍO A:*`,
        `${detail.customerName}`,
        `${detail.address}, ${detail.city}, ${detail.department}`,
        `Tel: ${detail.customerPhone}`,
        detail.proofUrl ? `\nComprobante: ${detail.proofUrl}` : `\nAdjunto comprobante en esta conversación.`
    ].filter(Boolean).join('\n');
};

/**
 * Genera URL completa con detalles detallados de la orden
 */
export const getWhatsAppOrderDetailLink = (detail: OrderWhatsAppDetail): string =>
    getWhatsAppLink(getWhatsAppOrderDetailMessage(detail));
