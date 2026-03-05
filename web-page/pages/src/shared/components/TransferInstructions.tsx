
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getWhatsAppOrderDetailLink, getWhatsAppLinkWithContext, type OrderWhatsAppDetail } from '@/constants/contacts';

interface TransferInstructionsProps {
    orderId: string;
    total: number;
    orderDetail?: OrderWhatsAppDetail;
    onReadyToUpload?: () => void;
}

const NEQUI_NUMBER = '3107405154';
const NEQUI_DISPLAY = '310 740 5154';

const TransferInstructions: React.FC<TransferInstructionsProps> = ({
    orderId,
    total,
    orderDetail,
    onReadyToUpload,
}) => {
    const { formatPrice } = useLanguage();
    const [copied, setCopied] = useState(false);

    const ref = orderId.slice(0, 8).toUpperCase();

    const whatsappLink = orderDetail
        ? getWhatsAppOrderDetailLink(orderDetail)
        : getWhatsAppLinkWithContext('order', orderId);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(NEQUI_NUMBER);
        } catch {
            const el = document.createElement('textarea');
            el.value = NEQUI_NUMBER;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="bg-[#1A261D] border border-[#C5A065]/30 rounded-2xl overflow-hidden max-w-2xl mx-auto">

            {/* Header */}
            <div className="bg-[#C5A065]/10 border-b border-[#C5A065]/20 px-6 py-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Orden #{ref}</p>
                    <p className="text-2xl font-serif text-[#C5A065]">{formatPrice(total)}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 px-3 py-1.5 rounded-full">
                    <span>💜</span>
                    <span className="font-bold">Nequi</span>
                </div>
            </div>

            <div className="p-6 space-y-5">

                {/* Número Nequi */}
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Envía tu pago a este número Nequi</p>
                    <div className="flex items-center justify-between bg-black/40 border border-[#8B5CF6]/30 rounded-xl p-4">
                        <span className="font-mono text-3xl text-white tracking-widest">{NEQUI_DISPLAY}</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-sm border px-4 py-2.5 rounded-lg transition-all font-bold"
                            style={{
                                borderColor: copied ? '#22c55e' : '#8B5CF6',
                                color: copied ? '#22c55e' : '#A78BFA',
                            }}
                        >
                            <span className="material-icons-outlined text-base">{copied ? 'check' : 'content_copy'}</span>
                            {copied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>

                {/* Detalle */}
                <div className="bg-black/20 rounded-xl px-5 py-4 flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Monto exacto</p>
                        <p className="text-lg font-bold text-white">{formatPrice(total)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Referencia</p>
                        <p className="text-lg font-bold text-[#C5A065]">ORD-{ref}</p>
                    </div>
                </div>

                {/* Acciones */}
                <button
                    onClick={onReadyToUpload}
                    className="w-full bg-[#C5A065] hover:bg-[#D4AF74] text-black font-bold py-4 px-6 rounded-xl uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#C5A065]/20"
                >
                    <span className="material-icons-outlined text-sm">cloud_upload</span>
                    Ya Pagué — Subir Comprobante
                </button>

                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-sm transition-all"
                >
                    <span className="material-icons-outlined text-sm">send</span>
                    Enviar Comprobante por WhatsApp
                </a>
            </div>
        </div>
    );
};

export default TransferInstructions;
