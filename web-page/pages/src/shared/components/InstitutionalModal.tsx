import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

interface InstitutionalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string | React.ReactNode;
    type?: 'success' | 'info' | 'error' | 'warning';
}

const InstitutionalModal: React.FC<InstitutionalModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-12 h-12 text-emerald-400" />;
            case 'error': return <XCircle className="w-12 h-12 text-red-400" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-amber-400" />;
            default: return <Info className="w-12 h-12 text-blue-400" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md overflow-hidden bg-[#1C2923] border border-white/10 rounded-3xl shadow-2xl animate-scale-up">
                {/* Header Background Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 opacity-20 ${type === 'success' ? 'bg-emerald-400' :
                        type === 'error' ? 'bg-red-400' :
                            type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-full bg-white/5 border ${type === 'success' ? 'border-emerald-400/20' :
                                type === 'error' ? 'border-red-400/20' :
                                    type === 'warning' ? 'border-amber-400/20' : 'border-blue-400/20'
                            }`}>
                            {getIcon()}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 font-accent tracking-wide uppercase">
                        {title}
                    </h3>

                    <div className="text-white/70 leading-relaxed mb-8">
                        {message}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-primary hover:bg-primary-hover text-background-dark font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/20 active:scale-95"
                    >
                        CONTINUAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalModal;
