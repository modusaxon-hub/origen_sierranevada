
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Leer .env manual
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_ANON_KEY'];

console.log(`Connecting to: ${url}`);
const supabase = createClient(url, key);

async function checkAuth() {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error('❌ Auth Error:', error.message);
            process.exit(1);
        } else {
            console.log('✅ Auth Service Connected!');
            console.log('Project is reachable.');
        }
    } catch (e) {
        console.error('❌ Exception:', e);
        process.exit(1);
    }
}

checkAuth();
