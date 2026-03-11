import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'CONFIRMAR',
    cancelText = 'CANCELAR',
    type = 'info'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger': return <AlertOctagon className="w-12 h-12 text-red-400" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-amber-400" />;
            case 'success': return <CheckCircle2 className="w-12 h-12 text-emerald-400" />;
            default: return <Info className="w-12 h-12 text-blue-400" />;
        }
    };

    const getConfirmStyles = () => {
        switch (type) {
            case 'danger': return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20';
            case 'warning': return 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20';
            case 'success': return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20';
            default: return 'bg-primary hover:bg-primary-hover text-background-dark shadow-primary/20';
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-sm overflow-hidden bg-[#1C2923] border border-white/10 rounded-3xl shadow-2xl animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center pt-10">
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-full bg-white/5 border ${type === 'danger' ? 'border-red-400/20' :
                            type === 'warning' ? 'border-amber-400/20' :
                                type === 'success' ? 'border-emerald-400/20' : 'border-blue-400/20'
                            }`}>
                            {getIcon()}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 font-accent tracking-wide uppercase leading-tight">
                        {title}
                    </h3>

                    <p className="text-white/60 text-sm leading-relaxed mb-10 px-4">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-4 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 ${getConfirmStyles()}`}
                        >
                            {confirmText}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-sm font-medium text-white/40 hover:text-white transition-colors"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
