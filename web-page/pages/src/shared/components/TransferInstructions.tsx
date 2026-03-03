
import React from 'react';
import { useLanguage } from '@/shared/store/LanguageContext';

const TransferInstructions: React.FC<{ orderId: number, total: number }> = ({ orderId, total }) => {
    const { formatPrice } = useLanguage();

    return (
        <div className="bg-[#1A261D] border border-[#C5A065]/30 rounded-2xl p-8 max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A065]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 bg-[#C5A065]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A065]/20">
                    <span className="material-icons-outlined text-[#C5A065] text-3xl">account_balance</span>
                </div>
                <h2 className="font-serif text-2xl text-[#C5A065] mb-2">Transferencia Bancaria</h2>
                <p className="text-gray-400 text-sm">Realiza el pago a cualquiera de nuestras cuentas oficiales</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="bg-white p-4 rounded-xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] group transition-transform hover:scale-105 duration-500">
                        <img
                            src="/assets/payment-qr.jpeg"
                            alt="Scan to Pay"
                            className="w-48 h-48 object-contain contrast-[1.1] brightness-[1.05]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A065] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">Escaneo de Alta Fidelidad</span>
                    </div>
                </div>

                {/* Account Details Section */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] text-[#C5A065] uppercase tracking-widest font-bold">Total a Pagar</p>
                        <p className="text-3xl font-serif text-white">{formatPrice(total)}</p>
                    </div>

                    <div className="h-px bg-white/10 w-full"></div>

                    <div className="space-y-4">
                        <div className="group">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 group-hover:text-[#C5A065] transition-colors">Bancolombia Ahorros</p>
                            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5 group-hover:border-[#C5A065]/30 transition-all">
                                <span className="font-mono text-lg text-white tracking-wider">000-000-0000</span>
                                <button className="text-gray-500 hover:text-white transition-colors" title="Copiar">
                                    <span className="material-icons-outlined text-sm">content_copy</span>
                                </button>
                            </div>
                        </div>

                        <div className="group">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 group-hover:text-[#C5A065] transition-colors">Nequi</p>
                            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5 group-hover:border-[#C5A065]/30 transition-all">
                                <span className="font-mono text-lg text-white tracking-wider">310 740 5154</span>
                                <button className="text-gray-500 hover:text-white transition-colors" title="Copiar">
                                    <span className="material-icons-outlined text-sm">content_copy</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
                <p className="text-sm text-gray-300 mb-2">
                    Una vez realizado el pago, envía el comprobante a nuestro WhatsApp indicando tu número de pedido: <strong className="text-[#C5A065]">#{orderId}</strong>
                </p>
                <a
                    href={`https://wa.me/573107405154?text=Hola,%20adjunto%20comprobante%20del%20pedido%20%23${orderId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#C5A065] hover:text-white transition-colors font-bold text-sm uppercase tracking-wider mt-2 border border-[#C5A065]/30 px-6 py-3 rounded-full hover:bg-[#C5A065] hover:text-black hover:border-transparent"
                >
                    <span className="material-icons-outlined">send</span>
                    Enviar Comprobante
                </a>
            </div>
        </div>
    );
};

export default TransferInstructions;
