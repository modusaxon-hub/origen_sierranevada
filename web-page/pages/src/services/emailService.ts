import { supabase } from './supabaseClient';
import { getWhatsAppLink, getWhatsAppMessage, CONTACTS } from '@/constants/contacts';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://origensierranevada.co';
const LOGO_URL = `https://oawhbhoywqfgnqgdyyer.supabase.co/storage/v1/object/public/brand/logo-origen-sierra-nevada.svg`;

export const emailService = {
    sendWelcomeEmail: async (email: string, fullName: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: '🌿 Tu Experiencia comienza aquí: Bienvenido a Origen Sierra Nevada',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #050806; border: 1px solid #C8AA6E; border-radius: 24px; overflow: hidden; margin-top: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                                .hero { position: relative; width: 100%; height: 350px; background-image: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200'); background-size: cover; background-position: center; border-bottom: 2px solid #C8AA6E; }
                                .overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, #050806 100%); }
                                .content { padding: 48px; text-align: center; }
                                .logo { width: 120px; margin-bottom: 32px; filter: drop-shadow(0 0 10px rgba(200, 170, 110, 0.5)); }
                                h1 { color: #FBF5B7; font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 16px; letter-spacing: -0.02em; font-weight: normal; font-style: italic; }
                                p { color: #ffffffb3; line-height: 1.8; font-size: 15px; margin-bottom: 24px; }
                                .status-card { background: rgba(200, 170, 110, 0.05); border: 1px solid rgba(200, 170, 110, 0.2); border-radius: 16px; padding: 24px; margin: 32px 0; }
                                .status-label { color: #C8AA6E; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 12px; display: block; }
                                .status-text { color: #ffffff; font-size: 16px; font-weight: 500; }
                                .footer { padding: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
                                .btn { display: inline-block; background: #C8AA6E; color: #000; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; transition: all 0.3s; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="hero">
                                    <div class="overlay"></div>
                                    <div style="position: absolute; bottom: 40px; width: 100%; text-align: center;">
                                        <img src="${LOGO_URL}" class="logo" alt="Logo">
                                    </div>
                                </div>
                                <div class="content">
                                    <h1>Un viaje sagrado ha comenzado...</h1>
                                    <p>Hola, <strong>${fullName}</strong>. <br><br> Es un honor recibir tu solicitud para formar parte de nuestra comunidad. En Origen Sierra Nevada, no solo vendemos café; cultivamos una conexión mística entre la montaña y tu espíritu.</p>
                                    
                                    <div class="status-card">
                                        <span class="status-label">Estado de la Membresía</span>
                                        <div class="status-text">En Espera de Autorización</div>
                                        <p style="margin-top: 12px; font-size: 13px; color: rgba(255,255,255,0.5);">Nuestros sumilleres y fundadores están revisando tu solicitud para nivelar la experiencia. Recibirás una señal en un plazo de 24 a 48 horas.</p>
                                    </div>

                                    <p style="font-style: italic; font-size: 14px; color: #C8AA6E;">"Todo lo que amas, desde el corazón de la Sierra."</p>
                                    
                                    <div style="margin-top: 40px;">
                                        <a href="${BASE_URL}" class="btn">Explorar el Origen</a>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.2);">© 2026 Origen Sierra Nevada SM • Santa Marta, Colombia</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error in sendWelcomeEmail:', error);
            return { success: false, error };
        }
    },

    sendApprovalEmail: async (email: string, fullName: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: '✨ Acceso Concedido: Bienvenido al Círculo de Origen',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #050806; border: 1px solid #C8AA6E; border-radius: 24px; overflow: hidden; margin-top: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                                .hero { position: relative; width: 100%; height: 350px; background-image: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200'); background-size: cover; background-position: center; border-bottom: 2px solid #C8AA6E; }
                                .overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, #050806 100%); }
                                .content { padding: 48px; text-align: center; }
                                .logo { width: 120px; margin-bottom: 24px; filter: drop-shadow(0 0 10px rgba(200, 170, 110, 0.5)); }
                                h1 { color: #C8AA6E; font-family: 'Playfair Display', serif; font-size: 36px; margin-bottom: 16px; font-weight: normal; }
                                p { color: #ffffffb3; line-height: 1.8; font-size: 15px; margin-bottom: 24px; }
                                .btn { display: inline-block; background: #C8AA6E; color: #000; font-weight: bold; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.25em; transition: all 0.3s; }
                                .footer { padding: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="hero">
                                    <div class="overlay"></div>
                                    <div style="position: absolute; top: 100px; width: 100%; text-align: center;">
                                        <span style="color: #C8AA6E; font-size: 64px;">✨</span>
                                    </div>
                                </div>
                                <div class="content">
                                    <img src="${LOGO_URL}" class="logo" alt="Logo">
                                    <h1>Tu registro ha sido aprobado</h1>
                                    <p>Hola, <strong>${fullName}</strong>. <br><br> La montaña ha hablado. Tu alma ha sido bienvenida al círculo interno de Origen Sierra Nevada.</p>
                                    <p>Ahora tienes acceso total a nuestro catálogo exclusivo, el Brandbook interactivo y beneficios únicos de nuestra comunidad de amantes del café de especialidad.</p>
                                    
                                    <div style="margin: 40px 0;">
                                        <a href="${BASE_URL}/#/login" class="btn">Iniciar la Experiencia de Compra</a>
                                    </div>

                                    <p style="font-size: 13px; color: rgba(255,255,255,0.4);">Prepárate para redescubrir lo que significa una verdadera taza de café.</p>

                                    <div style="margin: 40px 0; text-align: center; border-top: 1px solid rgba(200, 170, 110, 0.2); padding-top: 24px;">
                                        <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                                            ¿Preguntas sobre tu acceso?
                                        </p>
                                        <a href="https://wa.me/${CONTACTS.whatsapp.number.replace('+', '')}?text=${encodeURIComponent(getWhatsAppMessage('support'))}"
                                           style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">
                                            💬 Contáctanos por WhatsApp
                                        </a>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.2);">© 2026 Origen Sierra Nevada SM • Santa Marta, Colombia</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error in sendApprovalEmail:', error);
            return { success: false, error };
        }
    },

    sendOrderNotification: async (adminEmail: string, details: any) => {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: adminEmail,
                    subject: `🔔 Origen Alert: ${details.type || 'Nueva Actividad'}`,
                    html: `
                        <div style="font-family: sans-serif; color: #ffffff; background: #050806; padding: 40px; border-radius: 20px; border: 1px solid #C8AA6E;">
                            <h2 style="color: #C8AA6E;">Nueva Alerta de Sistema</h2>
                            <p style="color: rgba(255,255,255,0.6);">Se ha detectado una nueva acción que requiere su supervisión:</p>
                            <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 12px; border: 1px solid rgba(200, 170, 110, 0.2);">
                                <pre style="margin: 0; color: #FBF5B7; font-size: 14px;">${JSON.stringify(details, null, 2)}</pre>
                            </div>
                            <div style="margin-top: 32px; text-align: center;">
                                <a href="${BASE_URL}/#/admin" style="background: #C8AA6E; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; text-transform: uppercase;">Abrir Panel de Control</a>
                            </div>
                        </div>
                    `
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error in sendOrderNotification:', error);
            return { success: false, error };
        }
    },

    sendCustomerOrderEmail: async (email: string, fullName: string, orderDetails: any) => {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: `☕ Tu Pedido está en camino - Pedido #${orderDetails.orderId.slice(0, 8)}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', sans-serif; }
                                .container { max-width: 600px; margin: 20px auto; background-color: #050806; border: 1px solid #C8AA6E; border-radius: 24px; overflow: hidden; color: white; }
                                .content { padding: 40px; text-align: center; }
                                h1 { color: #C8AA6E; font-size: 28px; margin-bottom: 20px; }
                                .order-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; text-align: left; margin: 24px 0; }
                                .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                                .total { border-top: 1px solid rgba(200, 170, 110, 0.3); margin-top: 16px; padding-top: 16px; font-weight: bold; color: #C8AA6E; font-size: 18px; }
                                .footer { padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); font-size: 10px; color: rgba(255,255,255,0.3); }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="content">
                                    <img src="${LOGO_URL}" width="80" style="margin-bottom: 20px;">
                                    <h1>¡Gracias por tu compra!</h1>
                                    <p>Hola ${fullName}, tu selección de café de especialidad está siendo preparada.</p>
                                    
                                    <div class="order-card">
                                        <p style="color: #C8AA6E; font-size: 10px; text-transform: uppercase; font-weight: bold; margin-bottom: 16px;">Resumen del Pedido</p>
                                        <div style="color: rgba(255,255,255,0.7);">
                                            ${orderDetails.itemsSummary}
                                        </div>
                                        <div class="total">
                                            <span>Total Pagado:</span>
                                            <span style="float: right;">USD ${orderDetails.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <p style="font-size: 13px; color: rgba(255,255,255,0.5);">Recibirás una notificación cuando tu pedido sea despachado.</p>
                                    <a href="${BASE_URL}/#/account" style="display: inline-block; background: #C8AA6E; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 24px; font-size: 12px; text-transform: uppercase;">Rastrear mi pedido</a>

                                    <div style="margin-top: 32px; text-align: center; border-top: 1px solid rgba(200, 170, 110, 0.2); padding-top: 20px;">
                                        <p style="color: rgba(255,255,255,0.5); font-size: 10px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.1em;">
                                            ¿Necesitas confirmar tu pago o tienes preguntas?
                                        </p>
                                        <a href="https://wa.me/${CONTACTS.whatsapp.number.replace('+', '')}?text=${encodeURIComponent('Hola, adjunto comprobante del pedido')}"
                                           style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;">
                                            💬 Confirmar por WhatsApp
                                        </a>
                                    </div>
                                </div>
                                <div class="footer">ORIGEN SIERRA NEVADA SM • SANTA MARTA, COLOMBIA</div>
                            </div>
                        </body>
                        </html>
                    `
                }
            });
            return { success: !error, data };
        } catch (error) {
            return { success: false, error };
        }
    },

    sendNewsletterWelcome: async (email: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: '🌿 Tu puesto en la Sierra está reservado - Origen Sierra Nevada',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
                                .container { max-width: 600px; margin: 40px auto; background-color: #050806; border: 1px solid #C8AA6E; border-radius: 24px; overflow: hidden; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                                .header { background: linear-gradient(135deg, #050806 0%, #141E16 100%); padding: 60px 20px; border-bottom: 1px solid rgba(200, 170, 110, 0.2); }
                                .content { padding: 48px; }
                                h1 { font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 24px; font-weight: normal; color: #FBF5B7; font-style: italic; }
                                p { font-size: 16px; line-height: 1.8; color: rgba(255,255,255,0.7); margin-bottom: 32px; font-weight: 300; }
                                .btn { display: inline-block; background-color: #C8AA6E; color: #000000; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(200, 170, 110, 0.2); }
                                .footer { padding: 32px; background-color: #0a0e0c; color: rgba(255,255,255,0.3); font-size: 10px; border-top: 1px solid rgba(255,255,255,0.05); text-transform: uppercase; letter-spacing: 1px; }
                                .badge { display: inline-block; padding: 4px 12px; border: 1px solid #C8AA6E; border-radius: 100px; color: #C8AA6E; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <img src="${LOGO_URL}" width="140" alt="Origen Logo" style="filter: drop-shadow(0 0 15px rgba(200, 170, 110, 0.3));">
                                </div>
                                <div class="content">
                                    <div class="badge">Comunidad Origen</div>
                                    <h1>El ciclo ha comenzado</h1>
                                    <p>Gracias por unirte a nuestra comunidad. Has dado el primer paso para descubrir el verdadero espíritu de la Sierra Nevada.</p>
                                    <p>Serás el primero en recibir acceso a tuestes limitados, secretos de nuestra labor mística con IA y las historias que nacen entre los bosques de niebla.</p>
                                    <a href="${BASE_URL}" class="btn">Explorar el Origen</a>
                                </div>
                                <div class="footer">
                                    <p>© 2026 Origen Sierra Nevada • Santa Marta, Colombia</p>
                                    <p style="margin-top: 8px;">Cultivamos una conexión sagrada entre la montaña y tu espíritu.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                }
            });
            return { success: !error, data };
        } catch (error) {
            console.error('Error sending newsletter email:', error);
            return { success: false, error };
        }
    },

    sendStatusUpdateEmail: async (email: string, fullName: string, orderId: string, newStatus: string, shippingDetails?: { note?: string, receiptUrl?: string }) => {
        const statuses: any = {
            'pending_payment': { label: 'Esperando Pago', emoji: '⏳', color: '#FF7043' },
            'pending': { label: 'Por Confirmar', emoji: '🧐', color: '#FFB74D' },
            'paid': { label: 'Pago Confirmado', emoji: '✅', color: '#66BB6A' },
            'processing': { label: 'Preparando tu Café', emoji: '☕', color: '#C8AA6E' },
            'shipped': { label: 'Pedido Enviado', emoji: '🚚', color: '#42A5F5' },
            'delivered': { label: 'Entregado', emoji: '🏠', color: '#AB47BC' },
            'cancelled': { label: 'Pedido Cancelado', emoji: '❌', color: '#EF5350' }
        };

        const current = statuses[newStatus] || { label: newStatus, emoji: '🔔', color: '#C8AA6E' };

        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: `${current.emoji} Actualización: Pedido #${orderId.slice(0, 8)} - ${current.label}`,
                    html: `
                        <div style="background-color: #050806; padding: 40px; font-family: sans-serif; color: white; text-align: center; border: 1px solid #C8AA6E; border-radius: 20px;">
                            <img src="${LOGO_URL}" width="70" style="margin-bottom: 24px;">
                            <h2 style="color: #C8AA6E;">Hola ${fullName},</h2>
                            <p style="color: rgba(255,255,255,0.7);">Tu pedido tiene una nueva actualización en su proceso de entrega:</p>
                            
                            <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 16px; margin: 30px 0; border: 1px solid ${current.color}44;">
                                <span style="font-size: 40px; display: block; margin-bottom: 10px;">${current.emoji}</span>
                                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: ${current.color}; font-weight: bold;">Nuevo Estado</span>
                                <h1 style="color: ${current.color}; margin-top: 10px; font-size: 24px;">${current.label}</h1>
                            </div>

                            ${newStatus === 'shipped' && shippingDetails ? `
                                <div style="background: rgba(66, 165, 245, 0.1); border: 1px dashed #42A5F5; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 30px;">
                                    <h4 style="color: #42A5F5; margin-top: 0; text-transform: uppercase; font-size: 11px;">Información de Guía / Envío:</h4>
                                    <p style="color: white; font-size: 14px; margin-bottom: 15px;">${shippingDetails.note || 'Tu pedido ya está en manos de la transportadora.'}</p>
                                    ${shippingDetails.receiptUrl ? `
                                        <div style="text-align: center;">
                                            <p style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; margin-bottom: 10px;">Comprobante de despacho:</p>
                                            <img src="${shippingDetails.receiptUrl}" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}

                            <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                                Estamos trabajando para que disfrutes la esencia de la Sierra Nevada lo antes posible.
                            </p>

                            <div style="margin-top: 40px;">
                                <a href="${BASE_URL}/#/track/${orderId}" style="background: #C8AA6E; color: black; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Ver Detalles del Pedido</a>
                            </div>

                            <div style="margin-top: 32px; text-align: center; border-top: 1px solid rgba(200, 170, 110, 0.2); padding-top: 20px;">
                                <p style="color: rgba(255,255,255,0.5); font-size: 10px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.1em;">
                                    ¿Preguntas sobre tu envío?
                                </p>
                                <a href="https://wa.me/${CONTACTS.whatsapp.number.replace('+', '')}?text=${encodeURIComponent('Hola, tengo una pregunta sobre mi pedido')} "
                                   style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;">
                                    💬 Contáctanos por WhatsApp
                                </a>
                            </div>

                            <p style="margin-top: 50px; font-size: 10px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 2px;">
                                ORIGEN SIERRA NEVADA SM • TRANSMITIENDO EL ESPÍRITU DEL CAFÉ
                            </p>
                        </div>
                    `
                }
            });
            return { success: !error, data };
        } catch (error) {
            return { success: false, error };
        }
    }
};
