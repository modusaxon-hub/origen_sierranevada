import { supabase } from './supabaseClient';

const BASE_URL = 'https://origen2025.share.zrok.io';
const LOGO_URL = `${BASE_URL}/logo-origen-sierra-nevada.svg`;

export const emailService = {
    sendWelcomeEmail: async (email: string, fullName: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: '🌿 Tu Ritual comienza aquí: Bienvenido a Origen Sierra Nevada',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #050806; border: 1px solid #C5A065; border-radius: 24px; overflow: hidden; margin-top: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                                .hero { position: relative; width: 100%; height: 350px; background-image: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200'); background-size: cover; background-position: center; border-bottom: 2px solid #C5A065; }
                                .overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, #050806 100%); }
                                .content { padding: 48px; text-align: center; }
                                .logo { width: 120px; margin-bottom: 32px; filter: drop-shadow(0 0 10px rgba(197,160,101,0.5)); }
                                h1 { color: #FBF5B7; font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 16px; letter-spacing: -0.02em; font-weight: normal; font-style: italic; }
                                p { color: #ffffffb3; line-height: 1.8; font-size: 15px; margin-bottom: 24px; }
                                .status-card { background: rgba(197, 160, 101, 0.05); border: 1px solid rgba(197, 160, 101, 0.2); border-radius: 16px; padding: 24px; margin: 32px 0; }
                                .status-label { color: #C5A065; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 12px; display: block; }
                                .status-text { color: #ffffff; font-size: 16px; font-weight: 500; }
                                .footer { padding: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
                                .btn { display: inline-block; background: #C5A065; color: #000; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; transition: all 0.3s; }
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
                                    <h1>Un ritual sagrado ha comenzado...</h1>
                                    <p>Hola, <strong>${fullName}</strong>. <br><br> Es un honor recibir tu solicitud para formar parte de nuestra comunidad. En Origen Sierra Nevada, no solo vendemos café; cultivamos una conexión mística entre la montaña y tu espíritu.</p>
                                    
                                    <div class="status-card">
                                        <span class="status-label">Estado de la Membresía</span>
                                        <div class="status-text">En Espera de Autorización</div>
                                        <p style="margin-top: 12px; font-size: 13px; color: rgba(255,255,255,0.5);">Nuestros sumilleres y fundadores están revisando tu solicitud para nivelar la experiencia. Recibirás una señal en un plazo de 24 a 48 horas.</p>
                                    </div>

                                    <p style="font-style: italic; font-size: 14px; color: #C5A065;">"Todo lo que amas, desde el corazón de la Sierra."</p>
                                    
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
                                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #050806; border: 1px solid #C5A065; border-radius: 24px; overflow: hidden; margin-top: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                                .hero { position: relative; width: 100%; height: 350px; background-image: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200'); background-size: cover; background-position: center; border-bottom: 2px solid #C5A065; }
                                .overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, #050806 100%); }
                                .content { padding: 48px; text-align: center; }
                                .logo { width: 120px; margin-bottom: 24px; filter: drop-shadow(0 0 10px rgba(197,160,101,0.5)); }
                                h1 { color: #C5A065; font-family: 'Playfair Display', serif; font-size: 36px; margin-bottom: 16px; font-weight: normal; }
                                p { color: #ffffffb3; line-height: 1.8; font-size: 15px; margin-bottom: 24px; }
                                .btn { display: inline-block; background: #C5A065; color: #000; font-weight: bold; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.25em; transition: all 0.3s; }
                                .footer { padding: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="hero">
                                    <div class="overlay"></div>
                                    <div style="position: absolute; top: 100px; width: 100%; text-align: center;">
                                        <span style="color: #C5A065; font-size: 64px;">✨</span>
                                    </div>
                                </div>
                                <div class="content">
                                    <img src="${LOGO_URL}" class="logo" alt="Logo">
                                    <h1>Tu registro ha sido aprobado</h1>
                                    <p>Hola, <strong>${fullName}</strong>. <br><br> La montaña ha hablado. Tu alma ha sido bienvenida al círculo interno de Origen Sierra Nevada.</p>
                                    <p>Ahora tienes acceso total a nuestro catálogo exclusivo, el Brandbook interactivo y beneficios únicos de nuestra comunidad de amantes del café de especialidad.</p>
                                    
                                    <div style="margin: 40px 0;">
                                        <a href="${BASE_URL}/#/login" class="btn">Iniciar el Ritual de Compra</a>
                                    </div>

                                    <p style="font-size: 13px; color: rgba(255,255,255,0.4);">Prepárate para redescubrir lo que significa una verdadera taza de café.</p>
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
                        <div style="font-family: sans-serif; color: #ffffff; background: #050806; padding: 40px; border-radius: 20px; border: 1px solid #C5A065;">
                            <h2 style="color: #C5A065;">Nueva Alerta de Sistema</h2>
                            <p style="color: rgba(255,255,255,0.6);">Se ha detectado una nueva acción que requiere su supervisión:</p>
                            <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 12px; border: 1px solid rgba(197,160,101,0.2);">
                                <pre style="margin: 0; color: #FBF5B7; font-size: 14px;">${JSON.stringify(details, null, 2)}</pre>
                            </div>
                            <div style="margin-top: 32px; text-align: center;">
                                <a href="${BASE_URL}/#/admin" style="background: #C5A065; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; text-transform: uppercase;">Abrir Panel de Control</a>
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
                    subject: `☕ Tu Ritual está en camino - Pedido #${orderDetails.orderId.slice(0, 8)}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', sans-serif; }
                                .container { max-width: 600px; margin: 20px auto; background-color: #050806; border: 1px solid #C5A065; border-radius: 24px; overflow: hidden; color: white; }
                                .content { padding: 40px; text-align: center; }
                                h1 { color: #C5A065; font-size: 28px; margin-bottom: 20px; }
                                .order-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; text-align: left; margin: 24px 0; }
                                .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                                .total { border-top: 1px solid rgba(197,160,101,0.3); margin-top: 16px; padding-top: 16px; font-weight: bold; color: #C5A065; font-size: 18px; }
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
                                        <p style="color: #C5A065; font-size: 10px; text-transform: uppercase; font-weight: bold; margin-bottom: 16px;">Resumen del Pedido</p>
                                        <div style="color: rgba(255,255,255,0.7);">
                                            ${orderDetails.itemsSummary}
                                        </div>
                                        <div class="total">
                                            <span>Total Pagado:</span>
                                            <span style="float: right;">USD ${orderDetails.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <p style="font-size: 13px; color: rgba(255,255,255,0.5);">Recibirás una notificación cuando tu pedido sea despachado.</p>
                                    <a href="${BASE_URL}/#/account" style="display: inline-block; background: #C5A065; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 24px; font-size: 12px; text-transform: uppercase;">Rastrear mi pedido</a>
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
                    subject: '🌿 Bienvenido al Ritual de Origen Sierra Nevada',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { margin: 0; padding: 0; background-color: #050806; font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; }
                                .container { max-width: 600px; margin: 40px auto; background-color: #050806; border: 1px solid #C5A065; border-radius: 16px; overflow: hidden; text-align: center; }
                                .header { background-color: #C5A065; padding: 40px 20px; color: #050806; }
                                .content { padding: 48px 32px; }
                                h1 { font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 16px; font-weight: normal; color: #C5A065; }
                                p { font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 24px; }
                                .btn { display: inline-block; background-color: #C5A065; color: #050806; text-decoration: none; padding: 16px 32px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 16px; }
                                .footer { padding: 24px; background-color: #0a0e0c; color: rgba(255,255,255,0.4); font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div style="padding: 40px 0;">
                                    <img src="${LOGO_URL}" width="100" alt="Origen Logo">
                                </div>
                                <div class="content">
                                    <h1>El ciclo comienza</h1>
                                    <p>Gracias por unirte a nuestra comunidad. Has dado el primer paso para descubrir el verdadero espíritu de la Sierra Nevada.</p>
                                    <p>A partir de ahora, serás el primero en recibir consejos de preparación, acceso a cosechas exclusivas y noticias de nuestro laboratorio de IA.</p>
                                    <a href="${BASE_URL}/#/subscription" class="btn">Explorar Suscripciones</a>
                                </div>
                                <div class="footer">
                                    <p>© 2026 Origen Sierra Nevada. Todos los derechos reservados.</p>
                                    <p>Respetamos tu privacidad y tu tiempo. Solo contenido de calidad.</p>
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
    }
};
