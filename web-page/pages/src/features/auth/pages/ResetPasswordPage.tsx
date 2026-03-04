import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useSubmitThrottle } from '@/hooks/useSubmitThrottle';
import { supabase } from '@/services/supabaseClient';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { blocked, trigger } = useSubmitThrottle(3000);

    // Validar contraseña según criterios de RegisterPage
    const validatePassword = (pwd: string): { valid: boolean; message: string } => {
        if (pwd.length < 8) return { valid: false, message: 'Mínimo 8 caracteres' };
        if (!/[A-Z]/.test(pwd)) return { valid: false, message: 'Debe tener mayúscula' };
        if (!/[a-z]/.test(pwd)) return { valid: false, message: 'Debe tener minúscula' };
        if (!/[0-9]/.test(pwd)) return { valid: false, message: 'Debe tener número' };
        if (!/[!@#$%^&*]/.test(pwd)) return { valid: false, message: 'Debe tener carácter especial (!@#$%^&*)' };
        return { valid: true, message: '' };
    };

    const passwordValidation = validatePassword(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    // Detectar token de recovery en la URL (Supabase lo maneja en onAuthStateChange)
    useEffect(() => {
        const checkRecoveryMode = async () => {
            // Esperamos un poco para que Supabase maneje el token
            await new Promise(resolve => setTimeout(resolve, 500));

            // Detectar si estamos en modo recovery via onAuthStateChange
            const { data: { session } } = await supabase.auth.getSession();

            // Si hay sesión y el URL tiene #access_token=..., estamos en recovery
            const hash = window.location.hash;
            if (hash.includes('access_token') && hash.includes('type=recovery')) {
                setIsRecoveryMode(true);
            } else if (session?.user) {
                // Si no hay token pero hay sesión, probablemente es un usuario logueado
                setIsRecoveryMode(true);
            } else {
                // Sin sesión válida después de 5s
                setTimeout(() => {
                    if (!isRecoveryMode) {
                        setError('El enlace de recuperación ha expirado o no es válido.');
                    }
                }, 5000);
            }

            setInitializing(false);
        };

        checkRecoveryMode();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones
        if (!password.trim()) {
            setError('Ingresa una contraseña');
            return;
        }

        if (!passwordValidation.valid) {
            setError(passwordValidation.message);
            return;
        }

        if (!passwordsMatch) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        trigger();

        try {
            const { error: updateError } = await authService.updatePassword(password);
            if (updateError) {
                throw updateError;
            }

            // Limpiar URL y redirigir al home
            window.location.hash = '#/';
            navigate('/');
        } catch (err) {
            const errorMsg = (err as any).message || 'Error al actualizar la contraseña.';
            if (errorMsg.includes('unauthorized') || errorMsg.includes('invalid')) {
                setError('El enlace ha expirado. Intenta de nuevo con "¿Olvidaste tu contraseña?"');
            } else {
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    // Loading inicial
    if (initializing) {
        return (
            <div className="min-h-screen bg-[#050806] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#C8AA6E]/20 border-t-[#C8AA6E] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/40 text-sm">Verificando enlace de recuperación...</p>
                </div>
            </div>
        );
    }

    // Token expirado o inválido
    if (!isRecoveryMode) {
        return (
            <div className="min-h-screen bg-[#050806] flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0A0C0B]/95 backdrop-blur-2xl p-8 md:p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons-outlined text-red-500 text-3xl">lock_clock</span>
                    </div>
                    <h2 className="font-serif text-2xl text-white mb-3">Enlace Expirado</h2>
                    <p className="text-white/50 text-sm mb-8">
                        El enlace de recuperación ha expirado o no es válido. Solicita uno nuevo.
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="px-8 py-3 bg-[#C8AA6E] text-[#141E16] font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 transition-all"
                    >
                        Solicitar Nuevo Enlace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050806] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-[#C8AA6E]/20 bg-[#0A0C0B]/95 backdrop-blur-2xl p-8 md:p-10">
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8AA6E] to-transparent" />

                {/* Header */}
                <div className="mb-8">
                    <p className="text-[#C8AA6E]/60 text-[9px] uppercase tracking-[0.6em] font-bold mb-3">Resetear Contraseña</p>
                    <h2 className="font-serif text-3xl text-white mb-2">Nueva Contraseña</h2>
                    <p className="text-white/40 text-sm font-light">
                        Elige una contraseña fuerte para tu ritual.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Field */}
                    <div>
                        <label className="block text-[9px] text-[#C8AA6E]/60 uppercase tracking-[0.4em] font-bold mb-2">
                            Nueva Contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8AA6E]/40 focus:bg-white/[0.06] transition-all"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                <span className="material-icons-outlined text-sm">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                        {password && (
                            <p className={`text-xs mt-2 ${passwordValidation.valid ? 'text-[#C8AA6E]' : 'text-white/40'}`}>
                                {passwordValidation.message || '✓ Contraseña válida'}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-[9px] text-[#C8AA6E]/60 uppercase tracking-[0.4em] font-bold mb-2">
                            Confirmar Contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8AA6E]/40 focus:bg-white/[0.06] transition-all"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                <span className="material-icons-outlined text-sm">
                                    {showConfirm ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                        {confirmPassword && (
                            <p className={`text-xs mt-2 ${passwordsMatch ? 'text-[#C8AA6E]' : 'text-white/40'}`}>
                                {passwordsMatch ? '✓ Coinciden' : '✗ No coinciden'}
                            </p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || blocked || !passwordValidation.valid || !passwordsMatch}
                        className="w-full py-4 rounded-lg bg-[#C8AA6E] text-[#141E16] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(200,170,110,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#141E16]/40 border-t-[#141E16] rounded-full animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-sm">lock</span>
                                Guardar Nueva Contraseña
                            </>
                        )}
                    </button>
                </form>

                <p className="text-white/20 text-[10px] text-center mt-6">
                    Si tienes problemas, contacta a nuestro equipo.
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
