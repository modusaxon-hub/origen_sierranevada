import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { emailService } from '../services/emailService';
import { ShieldCheck, Eye, EyeOff, CheckCircle, Circle, UserPlus, ArrowRight } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (pass: string) => {
        const minLength = pass.length >= 8;
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        return {
            isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
            requirements: { minLength, hasUpper, hasLower, hasNumber, hasSpecial }
        };
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const passwordCheck = validatePassword(formData.password);

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!passwordCheck.isValid) {
            setError('La contraseña no cumple con los estándares de seguridad requeridos.');
            return;
        }

        setLoading(true);

        const { error: signUpError } = await authService.signUp(
            formData.email,
            formData.password,
            formData.fullName,
            formData.phone
        );

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        emailService.sendWelcomeEmail(formData.email, formData.fullName).catch(console.error);
        emailService.sendOrderNotification('origensierranevadasm@gmail.com', {
            type: 'NUEVO_REGISTRO',
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone
        }).catch(console.error);

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050806] px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#C8AA6E]/5 to-transparent pointer-events-none"></div>
                <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center relative z-10">
                    <div className="mb-8 inline-flex p-5 rounded-full bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 text-[#C8AA6E] animate-bounce">
                        <CheckCircle size={48} />
                    </div>

                    <h2 className="font-serif text-3xl text-white italic mb-6 italic tracking-tight uppercase">¡Bienvenido al Origen!</h2>
                    <p className="text-gray-400 mb-10 leading-relaxed font-light italic">
                        Es un placer tenerte con nosotros. Tu solicitud ha pasado a nuestra <span className="text-[#C8AA6E] font-medium">Fase de Bienvenida</span>.
                        Te avisaremos en cuanto tu perfil esté habilitado para iniciar el ritual de la mejor experiencia cafetera.
                    </p>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-[#C8AA6E] text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3 group"
                    >
                        Ir a Iniciar Sesión
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050806] pt-20 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#C8AA6E]/5 to-transparent pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/[0.01] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <img src="/logo-completo.svg" alt="Origen Sierra Nevada" className="h-20 w-auto mx-auto mb-6 filter brightness-110 drop-shadow-[0_0_20px_rgba(200,170,110,0.2)]" />
                    <h2 className="text-2xl font-serif text-white italic uppercase tracking-widest mb-2">Únete al Gremio</h2>
                    <p className="text-gray-500 text-sm font-light">Accede a tuestes exclusivos y herramientas de IA.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-xs text-center flex items-center gap-3 justify-center">
                        <ShieldCheck size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold group-focus-within:text-[#C8AA6E] transition-colors">Nombre Completo</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#C8AA6E]/50 transition-all text-sm"
                                placeholder="Tu nombre y apellido"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold group-focus-within:text-[#C8AA6E] transition-colors">Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#C8AA6E]/50 transition-all text-sm"
                                placeholder="+57 --- --- ----"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold group-focus-within:text-[#C8AA6E] transition-colors">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#C8AA6E]/50 transition-all text-sm"
                                placeholder="ritual@cafemalu.com"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold group-focus-within:text-[#C8AA6E] transition-colors">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#C8AA6E]/50 transition-all text-sm pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#C8AA6E] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold group-focus-within:text-[#C8AA6E] transition-colors">Confirmar</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#C8AA6E]/50 transition-all text-sm pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#C8AA6E] transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {formData.password && (
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {[
                                    { key: 'minLength', label: '8+ Letras' },
                                    { key: 'hasUpper', label: 'Mayúscula' },
                                    { key: 'hasNumber', label: 'Número' },
                                    { key: 'hasSpecial', label: 'Especial' }
                                ].map((req) => {
                                    const isDone = validatePassword(formData.password).requirements[req.key as keyof ReturnType<typeof validatePassword>['requirements']];
                                    return (
                                        <div key={req.key} className="flex items-center gap-2">
                                            {isDone ? <CheckCircle size={12} className="text-green-500" /> : <Circle size={12} className="text-white/10" />}
                                            <span className={`text-[10px] uppercase tracking-widest ${isDone ? 'text-white' : 'text-gray-600'}`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-4 py-2">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                required
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 checked:bg-[#C8AA6E] checked:border-[#C8AA6E] transition-all"
                            />
                            <CheckCircle className="absolute h-3.5 w-3.5 text-black opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                        </div>
                        <label htmlFor="acceptTerms" className="text-[10px] text-gray-500 leading-relaxed cursor-pointer uppercase tracking-widest">
                            He leído y acepto los <Link to="/terms" className="text-[#C8AA6E] hover:underline">Términos</Link> y la <Link to="/privacy" className="text-[#C8AA6E] hover:underline">Política de Privacidad</Link>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-[#C8AA6E] transition-all transform hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? 'Creando ritual...' : <><UserPlus size={18} /> Crear Cuenta</>}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-white/5 pt-8">
                    <p className="text-gray-500 text-xs uppercase tracking-widest">
                        ¿Ya eres del gremio?{' '}
                        <button onClick={() => navigate('/login')} className="text-[#C8AA6E] font-bold hover:text-white transition-colors ml-2">
                            Inicia Sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
