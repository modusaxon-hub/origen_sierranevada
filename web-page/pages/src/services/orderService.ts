import { supabase } from './supabaseClient';

export interface OrderItem {
    id: string;
    product_id: number;
    quantity: number;
    unit_price: number;
    product_name?: { es: string; en: string };
    products?: {
        name: any;
        image_url: string;
    }
}

export interface Order {
    id: string;
    created_at: string;
    status: 'pending' | 'pending_payment' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    shipping_address: any;
    payment_method?: string;
    order_items: OrderItem[];
    profiles?: { email: string };
    metadata?: any;
}

export const orderService = {
    /**
     * Obtiene todos los pedidos del usuario autenticado
     * RLS se encarga automáticamente del filtrado por user_id
     */
    getUserOrders: async (userId: string) => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles:user_id (email),
                order_items (
                    *,
                    products (
                        name,
                        image_url
                    )
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        return { data: data as Order[] | null, error };
    },

    /**
     * Obtiene los detalles completos de un pedido específico
     */
    getOrderDetails: async (orderId: string) => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles:user_id (email),
                order_items (
                    *,
                    products (*)
                )
            `)
            .eq('id', orderId)
            .single();

        return { data: data as Order | null, error };
    },

    /**
     * Mapea el estado del pedido a configuración de UI
     */
    getStatusConfig(status: string): { label: string; color: string; bgColor: string; icon: string } {
        const configs: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
            'pending_payment': {
                label: 'Esperando Pago',
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/10',
                icon: 'hourglass_empty'
            },
            'pending': {
                label: 'Por Confirmar',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/10',
                icon: 'pending'
            },
            'paid': {
                label: 'Pagado',
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-500/10',
                icon: 'check_circle'
            },
            'processing': {
                label: 'Preparando',
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-500/10',
                icon: 'coffee'
            },
            'shipped': {
                label: 'Enviado',
                color: 'text-sky-400',
                bgColor: 'bg-sky-500/10',
                icon: 'local_shipping'
            },
            'delivered': {
                label: 'Entregado',
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10',
                icon: 'home'
            },
            'cancelled': {
                label: 'Cancelado',
                color: 'text-rose-400',
                bgColor: 'bg-rose-500/10',
                icon: 'cancel'
            }
        };

        return configs[status] || configs['pending'];
    },

    /**
     * Sube el comprobante de pago (imagen/pdf) a Supabase Storage
     * Validación MIME + tamaño máximo 5MB
     */
    uploadPaymentProof: async (orderId: string, file: File) => {
        // Validación MIME (no solo extensión)
        const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        const MAX_BYTES = 5 * 1024 * 1024; // 5MB

        if (!ALLOWED_MIME.includes(file.type)) {
            return {
                url: null,
                error: { message: `Tipo de archivo no permitido: ${file.type}. Solo JPG, PNG, WEBP o PDF.` } as any
            };
        }

        if (file.size > MAX_BYTES) {
            return {
                url: null,
                error: { message: `Archivo excede 5MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB.` } as any
            };
        }

        // Sanitizar nombre (nunca usar el nombre original del usuario)
        const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(file.name.split('.').pop()?.toLowerCase() || '')
            ? file.name.split('.').pop()!.toLowerCase()
            : 'jpg';
        const safeFileName = `comprobante_${Date.now()}.${safeExt}`;
        const filePath = `${orderId}/${safeFileName}`;

        // 1. Subir al bucket 'payments'
        const { data, error } = await supabase.storage
            .from('payments')
            .upload(filePath, file);

        if (error) return { url: null, error };

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('payments')
            .getPublicUrl(filePath);

        // 3. Vincular URL al registro de pago (no usar metadata — columna no existe)
        const { error: updateError } = await supabase
            .from('payments')
            .update({ payment_evidence_url: publicUrl })
            .eq('order_id', orderId);

        return { url: publicUrl, error: updateError };
    }
};
