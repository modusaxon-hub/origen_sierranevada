import { supabase } from './supabaseClient';

export interface OrderItem {
    id: string;
    product_id: number;
    quantity: number;
    price_at_time: number;
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
                bgColor: 'bg-orange-500/20',
                icon: 'hourglass_empty'
            },
            'pending': {
                label: 'Por Confirmar',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/20',
                icon: 'pending'
            },
            'processing': {
                label: 'En Preparación',
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/20',
                icon: 'inventory_2'
            },
            'paid': {
                label: 'Pagado',
                color: 'text-green-400',
                bgColor: 'bg-green-500/20',
                icon: 'check_circle'
            },
            'shipped': {
                label: 'En Camino',
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/20',
                icon: 'local_shipping'
            },
            'delivered': {
                label: 'Entregado',
                color: 'text-green-400',
                bgColor: 'bg-green-500/20',
                icon: 'task_alt'
            },
            'cancelled': {
                label: 'Cancelado',
                color: 'text-red-400',
                bgColor: 'bg-red-500/20',
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

        // 3. Vincular URL al pedido en la tabla 'orders'
        const { data: order } = await supabase
            .from('orders')
            .select('metadata')
            .eq('id', orderId)
            .single();

        const currentMetadata = typeof order?.metadata === 'string'
            ? JSON.parse(order.metadata)
            : (order?.metadata || {});

        const updatedMetadata = {
            ...currentMetadata,
            payment_proof_url: publicUrl,
            proof_uploaded_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                metadata: updatedMetadata,
                status: 'pending' // Cambiamos a 'pending' (por confirmar) una vez subido
            })
            .eq('id', orderId);

        return { url: publicUrl, error: updateError };
    }
};
