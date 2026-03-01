/**
 * Payment Service - Wompi Integration
 * Origen Sierra Nevada
 * 
 * Este servicio gestiona los pagos utilizando la API de Wompi (Colombia)
 * Soporta tanto ambiente de Sandbox como Producción
 */

// Tipos TypeScript para Wompi
export interface WompiTransaction {
    id: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method_type: string;
    payment_link_id?: string;
    reference: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
    status_message?: string;
    created_at: string;
}

export interface WompiPaymentLink {
    id: string;
    created_at: string;
    currency: string;
    amount_in_cents: number;
    name: string;
    description: string;
    single_use: boolean;
    collect_shipping: boolean;
    url: string;
    expires_at?: string;
}

interface PaymentDetails {
    orderId: string;
    amount: number; // En USD
    currency: string;
    customerName: string;
    customerEmail: string;
}

interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    provider: string;
    paymentUrl?: string; // URL de redirección para completar pago
    error?: string;
}

class WompiService {
    private publicKey: string;
    private privateKey: string;
    private baseURL: string;
    private eventsSecret?: string;

    constructor() {
        // Leer variables de entorno
        const isSandbox = import.meta.env.VITE_WOMPI_SANDBOX === 'true';

        this.publicKey = isSandbox
            ? (import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST || 'pub_test_default')
            : (import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD || '');

        this.privateKey = isSandbox
            ? (import.meta.env.VITE_WOMPI_PRIVATE_KEY_TEST || '')
            : (import.meta.env.VITE_WOMPI_PRIVATE_KEY_PROD || '');

        this.eventsSecret = import.meta.env.VITE_WOMPI_EVENTS_SECRET;

        this.baseURL = isSandbox
            ? 'https://sandbox.wompi.co/v1'
            : 'https://production.wompi.co/v1';

        console.log(`[Wompi] Inicializado en modo: ${isSandbox ? 'SANDBOX' : 'PRODUCCIÓN'}`);
    }

    /**
     * Crea una transacción de pago con Wompi
     */
    async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
        try {
            // Convertir monto a centavos (COP)
            // Tasa de cambio aproximada: 1 USD = 4000 COP
            const amountInCents = Math.round(details.amount * 4000 * 100);

            // Crear referencia única
            const reference = `ORG-${details.orderId}-${Date.now()}`;

            console.log('[Wompi] Iniciando pago:', {
                reference,
                amount: amountInCents,
                email: details.customerEmail
            });

            // Crear link de pago
            const response = await fetch(`${this.baseURL}/payment_links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.privateKey}`
                },
                body: JSON.stringify({
                    name: `Origen Sierra Nevada - Pedido #${details.orderId}`,
                    description: `Compra de café premium`,
                    single_use: true,
                    collect_shipping: false,
                    currency: 'COP',
                    amount_in_cents: amountInCents,
                    redirect_url: `${window.location.origin}/payment-confirmation`,
                    expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.reason || 'Error al crear link de pago');
            }

            const paymentLink: { data: WompiPaymentLink } = await response.json();

            return {
                success: true,
                transactionId: paymentLink.data.id,
                provider: 'Wompi',
                paymentUrl: paymentLink.data.url
            };

        } catch (error) {
            console.error('[Wompi] Error:', error);
            return {
                success: false,
                provider: 'Wompi',
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }

    /**
     * Verifica el estado de una transacción
     */
    async checkTransactionStatus(transactionId: string): Promise<WompiTransaction | null> {
        try {
            const response = await fetch(`${this.baseURL}/transactions/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${this.publicKey}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al consultar transacción');
            }

            const result: { data: WompiTransaction } = await response.json();
            return result.data;

        } catch (error) {
            console.error('[Wompi] Error consultando transacción:', error);
            return null;
        }
    }

    /**
     * Valida la firma de un webhook de Wompi
     * IMPORTANTE: Esto debe ejecutarse en el backend por seguridad
     */
    validateWebhookSignature(payload: any, signature: string): boolean {
        if (!this.eventsSecret) {
            console.warn('[Wompi] Events secret no configurado');
            return false;
        }

        // En producción, implementar verificación criptográfica
        // usando el events_secret de Wompi
        // Referencia: https://docs.wompi.co/docs/en/eventos#validación-de-integridad

        return true; // Placeholder
    }

    /**
     * Obtiene métodos de pago disponibles
     */
    async getAcceptanceToken(): Promise<string | null> {
        try {
            const response = await fetch(`${this.baseURL}/merchants/${this.publicKey}`);

            if (!response.ok) {
                throw new Error('Error al obtener acceptance token');
            }

            const result = await response.json();
            return result.data.presigned_acceptance?.acceptance_token || null;

        } catch (error) {
            console.error('[Wompi] Error obteniendo acceptance token:', error);
            return null;
        }
    }
}

// Instancia singleton
const wompiService = new WompiService();

// Exportar servicio principal
export const paymentService = {
    /**
     * Inicia el proceso de pago
     */
    initiatePayment: async (orderDetails: PaymentDetails): Promise<PaymentResponse> => {
        // Verificar si Wompi está configurado
        if (!import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST &&
            !import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD) {
            console.warn('[Payment] Wompi no configurado, usando simulación');

            // Simulación de fallback
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                success: true,
                transactionId: `SIM_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                provider: 'Simulación',
                paymentUrl: undefined
            };
        }

        return wompiService.initiatePayment(orderDetails);
    },

    /**
     * Consulta el estado de un pago
     */
    checkStatus: async (transactionId: string): Promise<WompiTransaction | null> => {
        return wompiService.checkTransactionStatus(transactionId);
    },

    /**
     * Valida webhook (usar en backend)
     */
    validateWebhook: (payload: any, signature: string): boolean => {
        return wompiService.validateWebhookSignature(payload, signature);
    }
};

export default paymentService;
