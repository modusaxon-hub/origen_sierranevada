import { supabase } from './supabaseClient';
import type { Order } from './orderService';

/**
 * Genera CUFE (Código Único de Factura Electrónica) vía Web Crypto API SHA-384
 * Simplificado para MVP — no es el CUFE oficial DIAN (requiere firma digital)
 * Pero sirve como identificador único para trazabilidad interna
 */
const generateCUFE = async (invoiceNumber: string, issueDate: string, total: number, orderId: string): Promise<string> => {
    const input = [
        invoiceNumber,           // Numero de factura
        issueDate,               // Fecha de emision
        total.toFixed(2),        // Valor total
        '01',                    // Código impuesto (01 = IVA)
        '0.00',                  // Valor IVA (0% = No responsable)
        total.toFixed(2),        // Total con impuestos
        'OSN-NIT-TODO',          // NIT empresa (placeholder)
        orderId,                 // Número adicional (ID de orden)
        'OSN2026MVP'             // Clave técnica (en producción viene de DIAN)
    ].join('');

    // SHA-384 via Web Crypto API (sin librerías externas)
    const buffer = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
};

/**
 * Obtiene el siguiente número secuencial de factura
 * Simplemente cuenta registros + 1 (MVP)
 */
const getNextInvoiceNumber = async (): Promise<string> => {
    const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });

    const nextNum = (count || 0) + 1;
    return nextNum.toString().padStart(6, '0'); // "000001", "000002", etc.
};

export const invoiceService = {
    /**
     * Genera una factura para una orden
     * Idempotente: si ya existe para esa orden, retorna la existente
     */
    generateInvoice: async (
        orderId: string,
        order: Order,
        customer: {
            name: string;
            docType: string;
            docNumber: string;
            address: string;
            city: string;
            department: string;
            email: string;
            phone: string;
        }
    ) => {
        // 1. Verificar que no exista factura para esta orden
        const { data: existing } = await supabase
            .from('invoices')
            .select('*')
            .eq('order_id', orderId)
            .maybeSingle();

        if (existing) {
            return { data: existing, error: null }; // Idempotente: retorna la existente
        }

        // 2. Generar número secuencial
        const invoiceNumber = await getNextInvoiceNumber();
        const issueDate = new Date().toISOString();

        // 3. Generar CUFE
        const cufe = await generateCUFE(invoiceNumber, issueDate, order.total_amount, orderId);

        // 4. Insertar en tabla invoices
        const { data, error } = await supabase
            .from('invoices')
            .insert({
                order_id: orderId,
                invoice_number: invoiceNumber,
                cufe,
                issue_date: issueDate,
                status: 'sent'
            })
            .select()
            .single();

        return { data, error };
    },

    /**
     * Obtiene una factura existente por ID de orden
     */
    getInvoiceByOrderId: async (orderId: string) => {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('order_id', orderId)
            .maybeSingle();

        return { data, error };
    }
};
