import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useSubmitThrottle } from '@/hooks/useSubmitThrottle';
import { sanitizeText, isValidEmail } from '@/shared/utils/sanitize';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { blocked, trigger } = useSubmitThrottle(5000); // 5s throttle

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError('Ingresa tu correo electrónico');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Por favor ingresa un correo válido');
            return;
        }

        setLoading(true);
        trigger();

        try {
            const { error: resetError } = await authService.sendPasswordReset(email);
            if (resetError) {
                throw resetError;
            }
            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError((err as any).message || 'Error al enviar el enlace. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050806] flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-[#C8AA6E]/20 bg-[#0A0C0B]/95 backdrop-blur-2xl p-8 md:p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons-outlined text-[#C8AA6E] text-3xl">mail_outline</span>
                    </div>
                    <h2 className="font-serif text-2xl text-white mb-3">Enlace Enviado</h2>
                    <p className="text-white/50 text-sm mb-2">Hemos enviado un enlace de recuperación a:</p>
                    <p className="text-[#C8AA6E] font-semibold text-sm mb-6 break-all">{email}</p>
                    <p className="text-white/40 text-xs mb-8">
                        El enlace caduca en <strong>1 hora</strong>. Revisa tu bandeja de entrada (incluye spam).
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-[#C8AA6E] text-[#141E16] font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 transition-all"
                    >
                        Volver al Login
                    </Link>
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
                    <p className="text-[#C8AA6E]/60 text-[9px] uppercase tracking-[0.6em] font-bold mb-3">Recuperación</p>
                    <h2 className="font-serif text-3xl text-white mb-2">
                        ¿Olvidaste tu <span className="italic">contraseña</span>?
                    </h2>
                    <p className="text-white/40 text-sm font-light">
                        Te enviaremos un enlace para restablecerla.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-[9px] text-[#C8AA6E]/60 uppercase tracking-[0.4em] font-bold mb-2">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(sanitizeText(e.target.value))}
                            placeholder="tu@correo.com"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8AA6E]/40 focus:bg-white/[0.06] transition-all"
                            disabled={loading}
                        />
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
                        disabled={loading || blocked}
                        className="w-full py-4 rounded-lg bg-[#C8AA6E] text-[#141E16] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(200,170,110,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#141E16]/40 border-t-[#141E16] rounded-full animate-spin" />
                                Enviando...
                            </>
                        ) : blocked ? (
                            <>
                                <span className="material-icons-outlined text-sm">schedule</span>
                                Espera 5 segundos
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-sm">mail</span>
                                Enviar Enlace
                            </>
                        )}
                    </button>

                    {/* Back to Login */}
                    <div className="text-center pt-4 border-t border-white/5">
                        <p className="text-white/40 text-xs mb-2">¿Recordaste tu contraseña?</p>
                        <Link
                            to="/login"
                            className="text-[#C8AA6E] hover:text-[#C8AA6E]/80 text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Volver al Login
                        </Link>
                    </div>
                </form>

                <p className="text-white/20 text-[10px] text-center mt-6">
                    El enlace de recuperación caduca en 1 hora. Si no recibes el email, revisa tu carpeta de spam.
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
