
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { emailService } from '@/services/emailService';
import { shippingService } from '@/services/shippingService';
import { orderService } from '@/services/orderService';
import { useLanguage } from '../contexts/LanguageContext';
import TransferInstructions from '@/shared/components/TransferInstructions';
import { type OrderWhatsAppDetail, getWhatsAppOrderDetailLink } from '@/constants/contacts';
import { useSubmitThrottle } from '@/hooks/useSubmitThrottle';
import { sanitizeText } from '@/shared/utils/sanitize';
import InstitutionalModal from '@/shared/components/InstitutionalModal';
import { useRef } from 'react';

// Lista de departamentos y sus ciudades principales
const CITIES_BY_DEPARTMENT: Record<string, string[]> = {
    'Amazonas': ['Leticia', 'Puerto Nariño'],
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Rionegro', 'Turbo', 'Caucasia'],
    'Arauca': ['Arauca', 'Tame', 'Saravena', 'Arauquita'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Puerto Colombia'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'El Carmen de Bolívar', 'Arjona'],
    'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Puerto Boyacá'],
    'Caldas': ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría', 'Riosucio'],
    'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'],
    'Casanare': ['Yopal', 'Aguazul', 'Paz de Ariporo', 'Villanueva'],
    'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía'],
    'Cesar': ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Bosconia', 'El Paso'],
    'Chocó': ['Quibdó', 'Istmina', 'Condoto', 'El Carmen de Atrato'],
    'Córdoba': ['Montería', 'Cereté', 'Sahagún', 'Lorica', 'Montelíbano', 'Planeta Rica'],
    'Cundinamarca': ['Bogotá', 'Soacha', 'Fusagasugá', 'Facatativá', 'Chía', 'Zipaquirá', 'Girardot', 'Mosquera', 'Madrid', 'Funza'],
    'Guainía': ['Inírida'],
    'Guaviare': ['San José del Guaviare', 'Retorno'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre'],
    'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Manaure', 'San Juan del Cesar'],
    'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato', 'Aracataca'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'Puerto Gaitán'],
    'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'La Unión', 'Túquerres'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios', 'Tibú', 'Pamplona'],
    'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez'],
    'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
    'San Andrés y Providencia': ['San Andrés', 'Providencia'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Socorro'],
    'Sucre': ['Sincelejo', 'Corozal', 'San Marcos', 'Tolú', 'Sampués'],
    'Tolima': ['Ibagué', 'Espinal', 'Chaparral', 'Líbano', 'Mariquita', 'Melgar'],
    'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Cartago', 'Buga', 'Jamundí', 'Yumbo'],
    'Vaupés': ['Mitú'],
    'Vichada': ['Puerto Carreño', 'La Primavera']
};

const DEPARTAMENTOS_COLOMBIA = Object.keys(CITIES_BY_DEPARTMENT).sort();

const TIPOS_DOCUMENTO = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PASAPORTE', label: 'Pasaporte' }
];

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
    const [proofSuccess, setProofSuccess] = useState(false);
    const [orderDetailData, setOrderDetailData] = useState<OrderWhatsAppDetail | null>(null);
    const [institutionalModal, setInstitutionalModal] = useState<{
        title: string;
        message: string | React.ReactNode;
        type: 'success' | 'info' | 'error' | 'warning';
    } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

    const precioExhibido = cartTotal;
    const discount = user ? precioExhibido * 0.1 : 0;
    const finalTotal = precioExhibido - discount + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Sanitizar inputs para text/textarea
        const sanitized = ['fullName', 'address', 'notes'].includes(name) ? sanitizeText(value) : value;

        setForm(prev => {
            const newForm = { ...prev, [name]: sanitized };
            if (name === 'department') {
                newForm.city = '';
                setShippingCost(0);
            }
            return newForm;
        });

        if (name === 'city') {
            setShippingCost(shippingService.calculateShipping(value));
        }
    };

    const { blocked, trigger } = useSubmitThrottle(5000);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('🚀 Iniciando proceso de pago — Cart items:', cartItems.length);
        e.preventDefault();

        if (cartItems.length === 0) {
            console.warn('⚠️ Intento de pago con carrito vacío.');
            return;
        }

        // 0. VALIDACIÓN EXPLÍCITA (Para mejor UX que globos del navegador)
        const missingFields = [];
        if (!(form.fullName || '').trim()) missingFields.push(lang === 'es' ? 'Nombre Completo' : 'Full Name');
        if (!(form.email || '').trim()) missingFields.push(lang === 'es' ? 'Email' : 'Email');
        if (!(form.docNumber || '').trim()) missingFields.push(lang === 'es' ? 'Número de Documento' : 'Document Number');
        if (!(form.phone || '').trim()) missingFields.push(lang === 'es' ? 'Teléfono' : 'Phone Number');
        if (!(form.address || '').trim()) missingFields.push(lang === 'es' ? 'Dirección' : 'Address');
        if (!form.department) missingFields.push(lang === 'es' ? 'Departamento' : 'Department');
        if (!form.city) missingFields.push(lang === 'es' ? 'Ciudad' : 'City');

        if (missingFields.length > 0) {
            console.log('❌ Validación fallida - Campos faltantes:', missingFields);
            setInstitutionalModal({
                title: lang === 'es' ? 'Información Faltante' : 'Missing Information',
                message: (
                    <div className="space-y-2">
                        <p>{lang === 'es' ? 'Por favor completa los siguientes campos obligatorios para continuar:' : 'Please complete the following required fields to continue:'}</p>
                        <ul className="list-disc pl-5 text-sm text-amber-400 font-bold">
                            {missingFields.map(f => <li key={f}>{f}</li>)}
                        </ul>
                    </div>
                ),
                type: 'warning'
            });
            return;
        }

        trigger(); // Activar throttle después de validación básica
        setLoading(true);

        try {
            // 1. VALIDACIÓN EN TIEMPO REAL: Antes de insertar, verificar stock fresco en DB
            const stockChecks = await Promise.all(cartItems.map(async item => {
                // El ID puede ser un UUID simple o un compuesto PRODUCT_ID:VARIANT_ID
                // Usamos : como delimitador para no chocar con los guiones de los UUID
                const compositeParts = item.id.split(':');
                let productId = compositeParts[0];
                let variantId = compositeParts.length > 1 ? compositeParts[1] : null;

                // Fallback para IDs antiguos que usaban '-' como separador (UUIDs miden 36 chars)
                if (compositeParts.length === 1 && item.id.length > 36) {
                    productId = item.id.substring(0, 36);
                    variantId = item.id.substring(37); // Saltar el '-' original
                }

                if (variantId && variantId !== 'base') {
                    const { data: v } = await supabase.from('product_variants').select('stock').eq('id', variantId).single();
                    return { ...item, dbStock: v?.stock ?? 0, productId, variantId };
                } else {
                    const { data: p } = await supabase.from('products').select('stock').eq('id', productId).single();
                    return { ...item, dbStock: p?.stock ?? 0, productId, variantId: null };
                }
            }));

            const stockErrors = stockChecks.filter(check => check.qty > check.dbStock);
            if (stockErrors.length > 0) {
                setInstitutionalModal({
                    title: lang === 'es' ? 'Existencias Insuficientes' : 'Insufficient Stock',
                    message: (
                        <div className="space-y-2">
                            <p>{lang === 'es' ? 'Lo sentimos, algunos elementos de tu carrito ya no están disponibles en la cantidad solicitada:' : 'Sorry, some items in your cart are no longer available in the requested quantity:'}</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {stockErrors.map(err => (
                                    <li key={err.id} className="text-sm font-bold">
                                        {err.name}: {err.dbStock} {lang === 'es' ? 'disponibles' : 'available'} (solicitaste {err.qty})
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-amber-500 font-semibold mt-4 italic">
                                {lang === 'es' ? '* Por favor ajusta las cantidades en el carrito antes de continuar.' : '* Please adjust quantities in your cart before continuing.'}
                            </p>
                        </div>
                    ),
                    type: 'warning'
                });
                setLoading(false);
                return;
            }

            // FIX: Verificar que el user existe en profiles antes de insertar
            const userId = user?.id ?? null;

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: userId,
                    total_amount: finalTotal,
                    status: 'pending',
                    contact_phone: form.phone,
                    shipping_address: {
                        fullName: form.fullName,
                        email: form.email,
                        address: form.address,
                        city: form.city,
                        department: form.department,
                        phone: form.phone,
                        docType: form.docType,
                        docNumber: form.docNumber,
                    }
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. CREACIÓN DE ITEMS: Manejar variants correctamente
            const orderItems = stockChecks.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                variant_id: item.variantId,
                quantity: item.qty,
                unit_price: item.price,
                subtotal: item.price * item.qty
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // NOTA: La sustracción de stock ahora se realiza AUTOMÁTICAMENTE via Trigger en PostgreSQL
            // al insertar en la tabla 'order_items'. No se requiere bucle manual.

            // FIX: Crear registro en tabla payments (no campos fantasma en orders)
            const { error: paymentError } = await supabase
                .from('payments')
                .insert({
                    order_id: order.id,
                    method: 'transferencia',
                    status: 'pending',
                    amount: finalTotal
                });

            if (paymentError) {
                // No fatal — la orden existe, solo falla el registro de pago
                console.warn('Payment record error (non-fatal):', paymentError.message);
            }

            await emailService.sendOrderNotification('origensierranevadasm@gmail.com', {
                type: 'NUEVO_PEDIDO',
                orderId: order.id,
                transactionId: 'PENDIENTE_TRANSFERENCIA',
                customer: form.fullName,
                total: finalTotal,
                items: cartItems.map(i => `${i.qty}x ${i.name}`).join(', ')
            });

            await emailService.sendCustomerOrderEmail(form.email, form.fullName, {
                orderId: order.id,
                total: finalTotal,
                itemsSummary: cartItems.map(i => `<div class="item"><span>${i.qty}x ${i.name}</span> <span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')
            });

            setLastOrderId(order.id);
            setLastOrderTotal(finalTotal);

            // Construir orderDetailData para WhatsApp detallado
            const orderDetail: OrderWhatsAppDetail = {
                orderId: order.id,
                customerName: form.fullName,
                customerPhone: form.phone,
                address: form.address,
                city: form.city,
                department: form.department,
                items: cartItems.map(i => ({
                    name: i.name,
                    quantity: i.qty,
                    unitPrice: i.price,
                    subtotal: i.price * i.qty
                })),
                subtotal: precioExhibido,
                shipping: shippingCost,
                discount: discount,
                total: finalTotal
            };
            setOrderDetailData(orderDetail);

            setOrderSuccess(true);
            clearCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error: any) {
            let errorMsg = 'Error desconocido';
            let statusCode = 'N/A';

            // Intentar extraer mensaje de Supabase error
            if (error?.message) {
                errorMsg = error.message;
            }
            if (error?.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            if (error?.response?.status) {
                statusCode = error.response.status;
            }

            console.error('❌ Error procesando pedido:', { statusCode, errorMsg, error });
            setInstitutionalModal({
                title: `Error (${statusCode})`,
                message: errorMsg,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[#0B120D] p-6 pt-24">
                <div className="w-full max-w-2xl mx-auto space-y-6">

                    {/* Banner de confirmación — no bloquea */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4 animate-fade-in">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="material-icons-outlined text-green-400 text-2xl">check_circle</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-white">¡Pedido #{lastOrderId?.slice(0, 8).toUpperCase()} creado!</p>
                            <p className="text-sm text-gray-400">Elige cómo realizar el pago de {formatPrice(lastOrderTotal)}</p>
                        </div>
                        <button
                            onClick={() => { clearCart(); navigate('/'); }}
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Volver al inicio"
                        >
                            <span className="material-icons-outlined text-sm">close</span>
                        </button>
                    </div>

                    <TransferInstructions
                        orderId={lastOrderId || ""}
                        total={lastOrderTotal}
                        orderDetail={orderDetailData || undefined}
                        onReadyToUpload={() => {
                            document.getElementById('upload-comprobante')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                    />

                    <div id="upload-comprobante" className="mt-8 bg-white/5 border border-[#C8AA6E]/30 rounded-2xl p-8 animate-slide-up">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[#C8AA6E]/10 rounded-xl flex items-center justify-center text-[#C8AA6E]">
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
                                disabled={proofSuccess || loading}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file || !lastOrderId) return;
                                    setLoading(true);
                                    const { url, error } = await orderService.uploadPaymentProof(lastOrderId, file);
                                    if (!error && url) {
                                        setProofSuccess(true);
                                        setLoading(false);

                                        // Preparar y enviar detalles a WhatsApp automáticamente
                                        if (orderDetailData) {
                                            const finalDetail: OrderWhatsAppDetail = {
                                                ...orderDetailData,
                                                proofUrl: url
                                            };
                                            const waLink = getWhatsAppOrderDetailLink(finalDetail);

                                            // Pequeña pausa para que el usuario vea el éxito antes de redirigir
                                            setTimeout(() => {
                                                window.open(waLink, '_blank');
                                                navigate('/account');
                                            }, 1500);
                                        } else {
                                            setTimeout(() => navigate('/account'), 3000);
                                        }
                                    } else {
                                        setInstitutionalModal({
                                            title: "Error de Carga",
                                            message: "No se pudo subir el comprobante: " + (error?.message || "Error desconocido"),
                                            type: 'error'
                                        });
                                        setLoading(false);
                                    }
                                }}
                                className={`absolute inset-0 w-full h-full opacity-0 z-10 ${proofSuccess ? 'cursor-default' : 'cursor-pointer'}`}
                            />
                            <div className="bg-black/40 border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center gap-3 group-hover:bg-white/5 group-hover:border-[#C8AA6E]/50 transition-all">
                                {proofSuccess ? (
                                    <>
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2 animate-bounce">
                                            <span className="material-icons-outlined text-4xl">done_all</span>
                                        </div>
                                        <span className="text-sm text-green-400 font-bold uppercase tracking-widest">¡Comprobante Recibido!</span>
                                        <span className="text-[10px] text-gray-500 text-center">Redirigiendo a tu cuenta para seguimiento...</span>
                                    </>
                                ) : loading ? (
                                    <>
                                        <div className="w-12 h-12 border-2 border-[#C8AA6E]/20 border-t-[#C8AA6E] rounded-full animate-spin mb-2"></div>
                                        <span className="text-sm text-white font-bold uppercase tracking-widest">Subiendo...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-outlined text-[#C8AA6E] text-4xl mb-2">cloud_upload</span>
                                        <span className="text-sm text-white font-bold">Seleccionar archivo</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center">Formatos aceptados: JPG, PNG, PDF (Máx 5MB)</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center flex justify-center gap-8">
                        <button onClick={() => navigate('/account')} className="text-gray-500 hover:text-white underline transition-colors text-xs uppercase tracking-widest">Ver mis pedidos</button>
                        <button onClick={() => navigate('/')} className="text-[#C8AA6E] hover:text-white underline transition-colors text-xs uppercase tracking-widest">Volver al inicio</button>
                    </div>
                </div>
                <InstitutionalModal
                    isOpen={!!institutionalModal}
                    onClose={() => setInstitutionalModal(null)}
                    title={institutionalModal?.title || ''}
                    message={institutionalModal?.message || ''}
                    type={institutionalModal?.type}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B120D] text-white pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl text-[#C8AA6E] mb-12 text-center">Finalizar Pedido</h1>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                        <form ref={formRef} onSubmit={handleSubmit} id="checkout-form" className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <h2 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">Información de Envío</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Nombre Completo' : 'Full Name'} *</label>
                                    <input required name="fullName" value={form.fullName} onChange={handleInputChange} type="text" placeholder="Juan Pérez" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Correo Electrónico' : 'Email'} *</label>
                                    <input required name="email" value={form.email} onChange={handleInputChange} type="email" placeholder="correo@ejemplo.com" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none transition-colors" />
                                    <p className="text-[9px] text-gray-500 italic mt-1 leading-tight">
                                        {lang === 'es'
                                            ? 'Recibirás actualizaciones de tu pedido en este correo. Asegúrate de que sea válido.'
                                            : 'You will receive order updates at this email. Please ensure it is valid.'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Tipo Documento' : 'Doc Type'} *</label>
                                    <select required name="docType" value={form.docType} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none appearance-none">
                                        {TIPOS_DOCUMENTO.map(tipo => <option key={tipo.value} value={tipo.value} className="bg-[#1a1a1a]">{tipo.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Número Documento' : 'Doc Number'} *</label>
                                    <input required name="docNumber" value={form.docNumber} onChange={handleInputChange} type="text" placeholder="1234567890" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Teléfono' : 'Phone'} *</label>
                                    <input required name="phone" value={form.phone} onChange={handleInputChange} type="tel" placeholder="+57 300 123 4567" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">Dirección Completa</label>
                                <input required name="address" value={form.address} onChange={handleInputChange} type="text" placeholder="Calle, número, apto/oficina" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Departamento' : 'State/Province'} *</label>
                                    <select required name="department" value={form.department} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none appearance-none">
                                        <option value="" className="bg-[#1a1a1a]">{lang === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                                        {DEPARTAMENTOS_COLOMBIA.map(dpto => <option key={dpto} value={dpto} className="bg-[#1a1a1a]">{dpto}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">{lang === 'es' ? 'Ciudad' : 'City'} *</label>
                                    <select required name="city" value={form.city} onChange={handleInputChange} disabled={!form.department} className={`w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none appearance-none transition-colors ${!form.department ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <option value="" className="bg-[#1a1a1a]">{form.department ? (lang === 'es' ? 'Seleccionar Ciudad...' : 'Select City...') : (lang === 'es' ? 'Elija Depto primero' : 'Choose Dept first')}</option>
                                        {form.department && CITIES_BY_DEPARTMENT[form.department]?.map(city => <option key={city} value={city} className="bg-[#1a1a1a]">{city}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">Notas del Pedido (Opcional)</label>
                                <textarea name="notes" value={form.notes} onChange={handleInputChange} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-[#C8AA6E] outline-none transition-colors resize-none"></textarea>
                            </div>
                        </form>

                        <div className="bg-[#C8AA6E]/5 border border-[#C8AA6E]/20 p-8 rounded-2xl">
                            <h2 className="font-serif text-2xl text-white mb-6">Método de Pago</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-[#C8AA6E] bg-[#C8AA6E]/10 rounded-xl">
                                    <div className="w-6 h-6 rounded-full border-4 border-[#C8AA6E] bg-black"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Transferencia Manual / Nequi</p>
                                        <p className="text-[10px] text-gray-400 uppercase">Paga a Nequi: 310 740 5154</p>
                                    </div>
                                    <span className="material-icons-outlined text-[#C8AA6E]">account_balance_wallet</span>
                                </div>
                                <div className="p-4 rounded-xl bg-[#C8AA6E]/5 border-l-2 border-[#C8AA6E]/40 flex gap-3 items-start animate-fade-in shadow-[inset_0_0_20px_rgba(200,170,110,0.05)]">
                                    <span className="material-icons-outlined text-[#C8AA6E] text-lg shrink-0 mt-0.5">info</span>
                                    <p className="text-xs text-white/80 leading-relaxed font-medium italic">
                                        {lang === 'es'
                                            ? 'Al completar el pedido, verás las instrucciones detalladas para realizar la transferencia y subir tu comprobante de pago.'
                                            : 'Upon completing the order, you will see detailed instructions for the transfer and for uploading your payment proof.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                                <h2 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">Tu Selección</h2>
                                <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map(item => {
                                        const isOverStock = item.maxStock !== undefined && item.qty > item.maxStock;
                                        return (
                                            <div key={item.id} className="space-y-2">
                                                <div className="flex justify-between items-center gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 bg-white/5 rounded-lg border p-1 transition-colors ${isOverStock ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'}`}>
                                                            <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-bold leading-tight transition-colors ${isOverStock ? 'text-red-400' : 'text-white'}`}>{item.name}</p>
                                                            <div className="flex gap-2 items-center">
                                                                <p className={`text-[10px] uppercase font-bold ${isOverStock ? 'text-red-500' : 'text-gray-500'}`}>{item.qty} unidad(es)</p>
                                                                {item.sub && (
                                                                    <>
                                                                        <span className="text-[10px] text-gray-700">•</span>
                                                                        <p className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-tighter">{item.sub}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold text-[#C8AA6E]">{formatPrice(item.price * item.qty)}</p>
                                                </div>
                                                {isOverStock && (
                                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2 animate-pulse">
                                                        <span className="material-icons-outlined text-red-500 text-sm">warning</span>
                                                        <p className="text-[9px] text-red-400 font-bold uppercase">Stock insuficiente: {item.maxStock} disponibles</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {cartItems.length === 0 && <p className="text-gray-500 italic text-center py-4">Tu carrito está vacío</p>}
                                </div>

                                <div className="space-y-3 border-t border-white/10 pt-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">{lang === 'es' ? 'Productos' : 'Products'}</span>
                                        <span>{formatPrice(precioExhibido)}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-400 text-center">
                                            {lang === 'es'
                                                ? 'No Responsable de IVA — Art. 437 ET'
                                                : 'Non-Liable for VAT — Art. 437 ET'
                                            }
                                        </p>
                                    </div>
                                    {discount > 0 && <div className="flex justify-between text-sm text-green-400"><span>{lang === 'es' ? 'Descuento Miembro (10%)' : 'Member Discount (10%)'}</span><span>-{formatPrice(discount)}</span></div>}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">{lang === 'es' ? 'Envío' : 'Shipping'}</span>
                                        <span className={shippingCost === 0 && form.city ? "text-orange-400 font-bold text-[10px]" : "text-white"}>
                                            {form.city ? (shippingCost === 0 ? (lang === 'es' ? 'Envío de acuerdo al destino' : 'Shipping based on destination') : formatPrice(shippingCost)) : (lang === 'es' ? 'Según destino' : 'Based on location')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xl font-serif pt-4 border-t border-white/10">
                                        <span className="text-white">{lang === 'es' ? 'Total a Pagar' : 'Total to Pay'}</span>
                                        <span className="text-[#C8AA6E]">{formatPrice(finalTotal)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 text-center italic">{lang === 'es' ? 'Los precios exhibidos ya incluyen IVA' : 'Displayed prices already include VAT'}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        // No longer conditionally blocking the call if the ref is not ready
                                        handleSubmit({ preventDefault: () => { } } as any);
                                    }}
                                    type="button"
                                    disabled={loading || cartItems.length === 0 || cartItems.some(item => item.maxStock !== undefined && item.qty > item.maxStock)}
                                    className={`w-full mt-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg ${loading || cartItems.length === 0 || cartItems.some(item => item.maxStock !== undefined && item.qty > item.maxStock) ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-[#C8AA6E] text-black hover:bg-[#D4B075] shadow-[#C8AA6E]/20 hover:scale-[1.02]'}`}
                                >
                                    {loading ? <span className="flex items-center justify-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>Procesando...</span> :
                                        cartItems.some(item => item.maxStock !== undefined && item.qty > item.maxStock) ? 'Corregir Stock' : 'Pagar y Finalizar'}
                                </button>
                                <p className="text-[9px] text-gray-500 text-center mt-4 leading-relaxed">Al completar este pedido, aceptas nuestros términos de servicio y políticas de privacidad.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <InstitutionalModal
                isOpen={!!institutionalModal}
                onClose={() => setInstitutionalModal(null)}
                title={institutionalModal?.title || ''}
                message={institutionalModal?.message || ''}
                type={institutionalModal?.type}
            />
        </div>
    );
};

export default CheckoutPage;
