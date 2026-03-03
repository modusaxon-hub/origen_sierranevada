import { createClient } from '@supabase/supabase-js';

// Configuración del cliente de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERROR: Credenciales de Supabase no configuradas');
    console.error('Por favor, completa las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
    },
});

// Verificar conexión (opcional - solo en desarrollo)
if (import.meta.env.DEV) {
    supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
            console.warn('⚠️ Supabase: Error obteniendo sesión', error.message);
        } else {
            console.log('✅ Supabase: Cliente inicializado correctamente');
            if (data.session) {
                console.log('👤 Usuario autenticado:', data.session.user.email);
            }
        }
    });
}
