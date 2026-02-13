
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { emailService } from '../services/emailService';
import { paymentService } from '../services/paymentService';
import { shippingService } from '../services/shippingService';
import { orderService } from '../services/orderService';
import { useLanguage } from '../contexts/LanguageContext';
import TransferInstructions from '../components/TransferInstructions';

// Lista de departamentos colombianos
const DEPARTAMENTOS_COLOMBIA = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila',
    'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
    'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
    'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

// Tipos de documento para facturación colombiana
const TIPOS_DOCUMENTO = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PASAPORTE', label: 'Pasaporte' }
];

// Constantes de facturación colombiana
const IVA_RATE = 0.19; // 19% IVA Colombia

interface CheckoutForm {
    fullName: string;
    docType: string;
    docNumber: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    department: string;
    notes: string;
}

const CheckoutPage: React.FC = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { language, formatPrice } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [lastOrderTotal, setLastOrderTotal] = useState<number>(0);

    const [form, setForm] = useState<CheckoutForm>({
        fullName: user?.user_metadata?.full_name || '',
        docType: 'CC',
        docNumber: '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        address: '',
        city: '',
        department: '',
        notes: '',
    });

    const [shippingCost, setShippingCost] = useState(0);

    // =====================================================
    // CÁLCULOS DE FACTURACIÓN COLOMBIANA
    // El precio exhibido YA INCLUYE EL IVA
    // Solo desglosamos para la factura, no sumamos adicional
    // =====================================================

    // El cliente paga EXACTAMENTE lo que vio en el estante
    const precioExhibido = cartTotal; // Este precio YA tiene IVA incluido

    // Desglose para la factura (extracción del IVA incluido)
    // Fórmula: Base = Precio / (1 + IVA_RATE)
    const baseGravable = Math.round(precioExhibido / (1 + IVA_RATE));
    const ivaIncluido = precioExhibido - baseGravable;

    // Descuento del 10% para miembros (aplica sobre el precio exhibido)
    const discount = user ? precioExhibido * 0.1 : 0;

    // Total a pagar = Precio exhibido - Descuento + Envío
    // (NO sumamos IVA porque ya está incluido en el precio)
    const finalTotal = precioExhibido - discount + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'city') {
            setShippingCost(shippingService.calculateShipping(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setLoading(true);

        try {
            // 1. Crear el pedido en Supabase
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user?.id,
                    total_amount: finalTotal,
                    currency: 'USD',
                    shipping_address: {
                        fullName: form.fullName,
                        address: form.address,
                        city: form.city,
                        department: form.department,
                        phone: form.phone,
                    },
                    metadata: {
                        notes: form.notes,
                        discount_applied: discount > 0,
                        items_details: cartItems.map(i => ({
                            id: i.id,
                            name: i.name,
                            variant: i.variant || 'Standard'
                        }))
                    }
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Crear los items del pedido
            const orderItems = cartItems.map(item => ({
                order_id: order.id,
                product_id: parseInt(item.id),
                quantity: item.qty,
                price_at_time: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 2.5 Actualizar Inventario (Restar stock)
            for (const item of cartItems) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.id)
                    .single();

                if (product) {
                    await supabase
                        .from('products')
                        .update({ stock: Math.max(0, product.stock - item.qty) })
                        .eq('id', item.id);
                }
            }

            // 3. Flujo TRANSFERENCIA MANUAL (Wompi en Standby)
            console.log('Procesando orden para transferencia manual');

            // Actualizar orden como pendiente de transferencia
            await supabase
                .from('orders')
                .update({
                    status: 'pending_payment', // Mantenemos estado pendiente
                    payment_id: 'MANUAL_TRANSFER',
                    payment_method: 'transfer'
                })
                .eq('id', order.id);

            // 4. Notificar al admin (Nuevo Pedido Pendiente)
            await emailService.sendOrderNotification('cafemalusm@gmail.com', {
                type: 'NUEVO_PEDIDO', // Ajustar tipo si es necesario en emailService
                orderId: order.id,
                transactionId: 'PENDIENTE_TRANSFERENCIA',
                customer: form.fullName,
                total: finalTotal,
                items: cartItems.map(i => `${i.qty}x ${i.name}`).join(', ')
            });

            // 5. Notificar al Cliente con instrucciones (Idealmente el email debería tener las instrucciones también)
            await emailService.sendCustomerOrderEmail(form.email, form.fullName, {
                orderId: order.id,
                total: finalTotal,
                itemsSummary: cartItems.map(i => `<div class="item"><span>${i.qty}x ${i.name}</span> <span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')
            });

            // 6. Éxito local
            setLastOrderId(order.id);
            setLastOrderTotal(finalTotal);
            setOrderSuccess(true);
            clearCart();
            // No redirigimos automáticamente para dar tiempo a ver las instrucciones
            // scroll al top para ver el mensaje
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Error procesando pedido:', error);
            alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[#0B120D] flex items-center justify-center p-6 pt-24">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="w-20 h-20 bg-[#C5A065]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons-outlined text-[#C5A065] text-4xl">check_circle</span>
                        </div>
                        <h1 className="font-serif text-3xl text-white mb-2">¡Pedido Registrado!</h1>
                        <p className="text-gray-400">
                            Tu orden ha sido creada exitosamente. Para completarla, por favor realiza la transferencia y sube tu comprobante.
                        </p>
                    </div>

                    <TransferInstructions orderId={lastOrderId || ""} total={lastOrderTotal} />

                    {/* Subida de Comprobante */}
                    <div className="mt-8 bg-white/5 border border-[#C5A065]/30 rounded-2xl p-8 animate-slide-up">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[#C5A065]/10 rounded-xl flex items-center justify-center text-[#C5A065]">
                                <span className="material-icons-outlined">receipt_long</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-serif text-white">Sube tu Comprobante</h3>
                                <p className="text-xs text-gray-500">Agiliza la confirmación de tu pedido adjuntando la captura.</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file || !lastOrderId) return;

                                    setLoading(true);
                                    const { url, error } = await orderService.uploadPaymentProof(lastOrderId, file);
                                    setLoading(false);

                                    if (!error) {
                                        alert("¡Comprobante subido con éxito! Tu pedido pasará a revisión.");
                                        // Podemos marcar algo visualmente como completado o redirigir
                                        navigate('/account');
                                    } else {
                                        alert("Error al subir comprobante. Por favor intenta de nuevo.");
                                        console.error(error);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="bg-black/40 border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center gap-3 group-hover:bg-white/5 group-hover:border-[#C5A065]/50 transition-all">
                                <span className="material-icons-outlined text-[#C5A065] text-4xl mb-2">cloud_upload</span>
                                <span className="text-sm text-white font-bold">Seleccionar archivo</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center">Formatos aceptados: JPG, PNG, PDF (Máx 5MB)</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center flex justify-center gap-8">
                        <button
                            onClick={() => navigate('/account')}
                            className="text-gray-500 hover:text-white underline transition-colors text-xs uppercase tracking-widest"
                        >
                            Ver mis pedidos
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#C5A065] hover:text-white underline transition-colors text-xs uppercase tracking-widest"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B120D] text-white pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl text-[#C5A065] mb-12 text-center">Finalizar Ritual</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Formulario */}
                    <div className="lg:col-span-7 space-y-8">
                        <form onSubmit={handleSubmit} id="checkout-form" className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <h2 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">Información de Envío</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Nombre Completo' : 'Full Name'} *
                                    </label>
                                    <input
                                        required
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Juan Pérez"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Correo Electrónico' : 'Email'} *
                                    </label>
                                    <input
                                        required
                                        name="email"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Datos de Facturación - Documento */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Tipo Documento' : 'Doc Type'} *
                                    </label>
                                    <select
                                        required
                                        name="docType"
                                        value={form.docType}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none appearance-none"
                                    >
                                        {TIPOS_DOCUMENTO.map(tipo => (
                                            <option key={tipo.value} value={tipo.value} className="bg-[#1a1a1a]">
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Número Documento' : 'Doc Number'} *
                                    </label>
                                    <input
                                        required
                                        name="docNumber"
                                        value={form.docNumber}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="1234567890"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Teléfono' : 'Phone'} *
                                    </label>
                                    <input
                                        required
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleInputChange}
                                        type="tel"
                                        placeholder="+57 300 123 4567"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">Dirección Completa</label>
                                <input
                                    required
                                    name="address"
                                    value={form.address}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Calle, número, apto/oficina"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Departamento' : 'State/Province'} *
                                    </label>
                                    <select
                                        required
                                        name="department"
                                        value={form.department}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none appearance-none"
                                    >
                                        <option value="" className="bg-[#1a1a1a]">
                                            {lang === 'es' ? 'Seleccionar...' : 'Select...'}
                                        </option>
                                        {DEPARTAMENTOS_COLOMBIA.map(dpto => (
                                            <option key={dpto} value={dpto} className="bg-[#1a1a1a]">
                                                {dpto}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">
                                        {lang === 'es' ? 'Ciudad' : 'City'} *
                                    </label>
                                    <input
                                        required
                                        name="city"
                                        value={form.city}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder={lang === 'es' ? 'Bogotá' : 'City name'}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">Notas del Pedido (Opcional)</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C5A065] outline-none transition-colors resize-none"
                                ></textarea>
                            </div>
                        </form>

                        <div className="bg-[#C5A065]/5 border border-[#C5A065]/20 p-8 rounded-2xl">
                            <h2 className="font-serif text-2xl text-white mb-6">Método de Pago</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-[#C5A065] bg-[#C5A065]/10 rounded-xl">
                                    <div className="w-6 h-6 rounded-full border-4 border-[#C5A065] bg-black"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Integra / PoliPay (Redeban)</p>
                                        <p className="text-[10px] text-gray-400 uppercase">Tarjetas de Crédito, Débito, PSE</p>
                                    </div>
                                    <span className="material-icons-outlined text-[#C5A065]">account_balance_wallet</span>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center italic">Próximamente más métodos de pago disponibles</p>
                            </div>
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                                <h2 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">Tu Selección</h2>

                                <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 p-1">
                                                    <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight">{item.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase">{item.qty} unidad(es)</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-[#C5A065]">{formatPrice(item.price * item.qty)}</p>
                                        </div>
                                    ))}
                                    {cartItems.length === 0 && (
                                        <p className="text-gray-500 italic text-center py-4">Tu carrito está vacío</p>
                                    )}
                                </div>

                                <div className="space-y-3 border-t border-white/10 pt-6">
                                    {/* Precio que el cliente vio (YA incluye IVA) */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            {lang === 'es' ? 'Productos' : 'Products'}
                                        </span>
                                        <span>{formatPrice(precioExhibido)}</span>
                                    </div>

                                    {/* Desglose informativo del IVA (ya incluido en el precio) */}
                                    <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                                            {lang === 'es' ? 'Desglose fiscal (IVA incluido)' : 'Tax breakdown (VAT included)'}
                                        </p>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{lang === 'es' ? 'Base gravable' : 'Taxable base'}</span>
                                            <span>{formatPrice(baseGravable)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>IVA (19%)</span>
                                            <span>{formatPrice(ivaIncluido)}</span>
                                        </div>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-400">
                                            <span>{lang === 'es' ? 'Descuento Miembro (10%)' : 'Member Discount (10%)'}</span>
                                            <span>-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">{lang === 'es' ? 'Envío' : 'Shipping'}</span>
                                        <span className={shippingCost === 0 && form.city ? "text-green-400 font-bold text-xs" : "text-white"}>
                                            {form.city ? (shippingCost === 0 ? (lang === 'es' ? '¡GRATIS!' : 'FREE!') : formatPrice(shippingCost)) : (lang === 'es' ? 'Según destino' : 'Based on location')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xl font-serif pt-4 border-t border-white/10">
                                        <span className="text-white">{lang === 'es' ? 'Total a Pagar' : 'Total to Pay'}</span>
                                        <span className="text-[#C5A065]">{formatPrice(finalTotal)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 text-center italic">
                                        {lang === 'es'
                                            ? 'Los precios exhibidos ya incluyen IVA'
                                            : 'Displayed prices already include VAT'}
                                    </p>
                                </div>

                                <button
                                    form="checkout-form"
                                    disabled={loading || cartItems.length === 0}
                                    className={`w-full mt-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg ${loading || cartItems.length === 0
                                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                        : 'bg-[#C5A065] text-black hover:bg-[#D4B075] shadow-[#C5A065]/20 hover:scale-[1.02]'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                                            Procesando...
                                        </span>
                                    ) : 'Pagar y Finalizar'}
                                </button>

                                <p className="text-[9px] text-gray-500 text-center mt-4 leading-relaxed">
                                    Al completar este ritual, aceptas nuestros términos de servicio y políticas de privacidad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
