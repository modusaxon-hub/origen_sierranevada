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
    status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    shipping_address: any;
    payment_method?: string;
    order_items: OrderItem[];
}

export const orderService = {
    /**
     * Obtiene todos los pedidos del usuario autenticado
     * RLS se encarga automáticamente del filtrado por user_id
     */
    getUserOrders: async () => {
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
     */
    uploadPaymentProof: async (orderId: string, file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `proof_${orderId}_${Date.now()}.${fileExt}`;
        const filePath = `${orderId}/${fileName}`;

        // 1. Subir al bucket 'payments'
        const { data, error } = await supabase.storage
            .from('payments')
            .upload(filePath, file);

        if (error) return { data: null, error };

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('payments')
            .getPublicUrl(filePath);

        // 3. Vincular URL al pedido en la tabla 'orders'
        // Lo guardamos en el JSON de metadata para no alterar el esquema fijo
        const { data: order } = await supabase
            .from('orders')
            .select('metadata')
            .eq('id', orderId)
            .single();

        const updatedMetadata = {
            ...order?.metadata,
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
