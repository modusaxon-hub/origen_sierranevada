
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_EMAIL = 'manuel78pertuz@gmail.com';
const ADMIN_PASSWORD = '@Dmintest12345';
const ADMIN_NAME = 'Admin Demo';
const ADMIN_PHONE = '3132576302';

async function createAdmin() {
    console.log(`[1/3] Attempting to create user: ${ADMIN_EMAIL}...`);

    const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
            data: {
                full_name: ADMIN_NAME,
                phone: ADMIN_PHONE
            }
        }
    });

    if (error) {
        if (error.message.includes('already registered') || error.status === 400) {
            console.log(`[INFO] User already exists.`);
        } else {
            console.error(`[ERROR] creating user:`, error.message);
            process.exit(1);
        }
    } else {
        // Check if we got a user back (sometimes if confirmation is required we get a user but session null)
        if (data.user) {
            console.log(`[SUCCESS] User created! ID: ${data.user.id}`);
            console.log(`[NOTE] If email confirmation is enabled in your project, go confirm it now!`);
        }
    }

    // NOTE: We cannot promote to admin via this script because we are using the ANON key.
    // The 'public.profiles' table RLS prevents us from updating the role (unless we own the row, but we can't update 'role' column usually if we locked it down, OR we defined specific policies).
    // I will handle the promotion via a separate SQL command using the Agent's MCP tools which have admin privileges (hopefully).
    console.log(`[2/3] User setup phase complete.`);
}

createAdmin();
