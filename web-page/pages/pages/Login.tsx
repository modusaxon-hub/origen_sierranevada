import React, { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
    const navigate = useNavigate();
    const { signIn, isAuthenticated, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Si ya está autenticado, redirigir al home
    if (isAuthenticated && !isLoading) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validación básica
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        // Intentar login
        const { error: loginError } = await signIn({ email, password });

        if (loginError) {
            setError(loginError);
            setLoading(false);
        } else {
            // Login exitoso, redirigir
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center px-6">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Card de Login */}
            <div className="relative w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-gold text-5xl">filter_drama</span>
                    </div>
                    <h1 className="font-serif text-4xl text-gold mb-2">Origen Sierra Nevada</h1>
                    <p className="text-white/40 font-sans text-sm uppercase tracking-widest">Panel de Administración</p>
                </div>

                {/* Formulario */}
                <div className="bg-primary/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="font-serif text-2xl text-white mb-6">Iniciar Sesión</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                            <p className="text-red-400 text-sm font-sans">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-sans text-white/60 mb-2 uppercase tracking-wider">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-gold transition-colors"
                                placeholder="admin@origensierranevada.com"
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-sans text-white/60 mb-2 uppercase tracking-wider">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-gold transition-colors"
                                placeholder="••••••••"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold text-primary h-14 rounded-lg font-sans font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-white/40 text-xs font-sans text-center">
                            ¿Olvidaste tu contraseña? Contacta al administrador del sistema.
                        </p>
                    </div>
                </div>

                {/* Info adicional */}
                <div className="mt-6 text-center">
                    <p className="text-white/20 text-xs font-sans">
                        © 2024 Origen Sierra Nevada. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
