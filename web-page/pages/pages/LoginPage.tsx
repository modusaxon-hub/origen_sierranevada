
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshAuth } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Attempt Sign In
            const { error: signInError } = await authService.signIn(email, password);

            if (signInError) {
                // If Supabase returns an error (like wrong password), throw it to be caught below
                throw new Error(signInError.message === 'Invalid login credentials'
                    ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
                    : 'Error al iniciar sesión: ' + signInError.message);
            }

            // 2. Success - Refresh Context
            await refreshAuth();

            // 3. User Role Check (with timeout safeguard)
            const user = await authService.getUser();

            if (user) {
                // We wrap the DB check in a promise race to prevent infinite hanging
                const checkAdminPromise = authService.checkIsAdmin(user.id);
                const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000));

                const isAdmin = await Promise.race([checkAdminPromise, timeoutPromise]);

                if (isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }

        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
        } finally {
            // ALWAYS unlock the button
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 pt-20 px-4">
            <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-[#C5A065]/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(197,160,101,0.1)]">

                <div className="text-center mb-10">
                    <div className="inline-block relative mb-8">
                        <img src="/logo-completo.svg" alt="Origen Sierra Nevada" className="h-20 sm:h-24 md:h-28 w-auto mx-auto object-contain drop-shadow-[0_0_30px_rgba(197,160,101,0.3)] brightness-125" />
                    </div>

                    <h2 className="font-display text-3xl text-white mb-2 tracking-wide">Bienvenido</h2>
                    <p className="text-white/60 text-sm font-light">Ingresa y vive la mejor Experiencia.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[#C5A065] text-xs uppercase tracking-widest font-bold mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A065] focus:ring-1 focus:ring-[#C5A065] transition-all"
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[#C5A065] text-xs uppercase tracking-widest font-bold ml-1">Contraseña</label>
                            <a href="#" className="text-xs text-white/40 hover:text-[#C5A065] transition-colors underline decoration-white/20 hover:decoration-[#C5A065]">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A065] focus:ring-1 focus:ring-[#C5A065] transition-all pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-icons-outlined text-xl">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#C5A065] to-[#AA771C] text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:shadow-[0_0_30px_rgba(197,160,101,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-white/40 text-sm">
                        ¿Aún no eres parte del Origen?{' '}
                        <button onClick={() => navigate('/register')} className="text-[#C5A065] font-bold hover:text-white transition-colors underline decoration-[#C5A065]/50 hover:decoration-white">
                            Crea tu cuenta aquí
                        </button>
                    </p>
                    <p className="text-white/20 text-xs mt-4">Sistema seguro protegido por criptografía</p>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
