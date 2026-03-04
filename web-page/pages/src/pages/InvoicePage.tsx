import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { orderService } from '@/services/orderService';
import { invoiceService } from '@/services/invoiceService';
import InvoicePrototype from '@/components/Invoice/InvoicePrototype';

interface InvoiceData {
    invoiceNumber: string;
    cufe: string;
    issueDate: string;
}

interface OrderData {
    id: string;
    customer_name: string;
    customer_email: string;
    shipping_address: {
        fullName: string;
        address: string;
        city: string;
        department: string;
        docType: string;
        docNumber: string;
        phone: string;
    };
    order_items: Array<{
        product_id: number;
        quantity: number;
        price_at_time: number;
        products: {
            name: any;
            image_url: string;
        };
    }>;
    total_amount: number;
    metadata?: any;
}

const InvoicePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInvoiceData = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Obtener datos de la orden
                const { data: orderData, error: orderError } = await orderService.getOrderDetails(orderId);
                if (orderError || !orderData) {
                    setError('No se encontró la orden');
                    setLoading(false);
                    return;
                }
                setOrder(orderData);

                // Obtener datos de la factura
                const { data: invoiceData, error: invoiceError } = await invoiceService.getInvoiceByOrderId(orderId);

                if (invoiceError) {
                    setError('Error al cargar la factura');
                    setLoading(false);
                    return;
                }

                if (!invoiceData) {
                    // Generar factura si no existe
                    const customerFromShipping = orderData.shipping_address;
                    const { data: newInvoice, error: genError } = await invoiceService.generateInvoice(
                        orderId,
                        orderData as any,
                        {
                            name: customerFromShipping.fullName,
                            docType: customerFromShipping.docType,
                            docNumber: customerFromShipping.docNumber,
                            address: customerFromShipping.address,
                            city: customerFromShipping.city,
                            department: customerFromShipping.department,
                            email: orderData.customer_email || customerFromShipping.city,
                            phone: customerFromShipping.phone
                        }
                    );

                    if (genError || !newInvoice) {
                        setError('Error al generar factura');
                        setLoading(false);
                        return;
                    }

                    setInvoice({
                        invoiceNumber: newInvoice.invoice_number,
                        cufe: newInvoice.cufe,
                        issueDate: newInvoice.issue_date
                    });
                } else {
                    setInvoice({
                        invoiceNumber: invoiceData.invoice_number,
                        cufe: invoiceData.cufe,
                        issueDate: invoiceData.issue_date
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading invoice:', err);
                setError('Error inesperado al cargar la factura');
                setLoading(false);
            }
        };

        loadInvoiceData();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B120D] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-[#C5A065] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando factura...</p>
                </div>
            </div>
        );
    }

    if (error || !invoice || !order) {
        return (
            <div className="min-h-screen bg-[#0B120D] flex items-center justify-center p-6">
                <div className="max-w-md bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
                    <span className="material-icons-outlined text-red-400 text-4xl mb-4 block">error</span>
                    <h2 className="text-xl text-white mb-2">Error</h2>
                    <p className="text-gray-300 text-sm">{error || 'No se pudo cargar la factura'}</p>
                </div>
            </div>
        );
    }

    // Mapear order_items al formato esperado por InvoicePrototype
    const items = order.order_items.map(item => ({
        name: typeof item.products.name === 'string'
            ? item.products.name
            : item.products.name?.es || 'Producto',
        quantity: item.quantity,
        unitPrice: item.price_at_time,
        subtotal: item.quantity * item.price_at_time
    }));

    // Calcular subtotal, envío y descuento desde metadata o estimados
    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const metadata = typeof order.metadata === 'string' ? JSON.parse(order.metadata) : order.metadata || {};
    const discount = metadata.discount_applied ? Math.round(subtotal * 0.1) : 0;
    const shipping = order.total_amount - subtotal + discount;

    return (
        <div className="min-h-screen bg-[#0B120D] py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header con botones */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-serif text-[#C5A065]">Factura Electrónica</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-6 py-3 bg-[#C5A065] text-black font-bold rounded-lg hover:bg-[#D4B075] transition-colors"
                        >
                            <span className="material-icons-outlined">print</span>
                            Imprimir
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-6 py-3 border border-[#C5A065] text-[#C5A065] font-bold rounded-lg hover:bg-[#C5A065]/10 transition-colors"
                        >
                            <span className="material-icons-outlined">arrow_back</span>
                            Atrás
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <InvoicePrototype
                    invoiceNumber={invoice.invoiceNumber}
                    cufe={invoice.cufe}
                    date={invoice.issueDate.split('T')[0]}
                    customerName={order.shipping_address.fullName}
                    customerDocType={order.shipping_address.docType}
                    customerDocNumber={order.shipping_address.docNumber}
                    customerAddress={order.shipping_address.address}
                    customerCity={order.shipping_address.city}
                    customerEmail={order.customer_email}
                    items={items}
                    subtotal={subtotal}
                    shipping={shipping}
                    discount={discount}
                    total={order.total_amount}
                    orderId={order.id}
                />
            </div>

            {/* Print-only footer */}
            <style>{`
                @media print {
                    body { background-color: white; }
                    .no-print { display: none; }
                }
            `}</style>
        </div>
    );
};

export default InvoicePage;
