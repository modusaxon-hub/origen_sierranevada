import React, { useState } from 'react';
import InstitutionalModal from '@/shared/components/InstitutionalModal';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackOrderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = orderId.trim();
        if (!cleanId) return;

        setLoading(true);
        // Pequeña demora para feedback visual de premium
        setTimeout(() => {
            setLoading(false);
            onClose();
            navigate(`/track/${cleanId}`);
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <InstitutionalModal
            isOpen={isOpen}
            onClose={onClose}
            title="Rastrear Pedido"
            type="info"
            message={
                <div className="space-y-6 text-left mt-4">
                    <p className="text-sm text-white/60 text-center leading-relaxed">
                        Ingresa el código de tu pedido para conocer en qué fase de su viaje desde la Sierra Nevada se encuentra.
                    </p>

                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#C8AA6E]/60 group-focus-within:text-[#C8AA6E] transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Ej: ac9e4f90..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:border-[#C8AA6E]/50 focus:outline-none focus:ring-1 focus:ring-[#C8AA6E]/50 transition-all font-mono text-sm"
                            autoFocus
                        />
                    </form>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSearch}
                            disabled={!orderId.trim() || loading}
                            className={`w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${!orderId.trim() || loading
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-[#C8AA6E] text-black hover:brightness-110 shadow-xl shadow-[#C8AA6E]/10'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span className="material-icons-outlined text-sm">radar</span>
                                    Sintonizar Pedido
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-white/20 text-center uppercase tracking-widest font-light">
                            Encuentra el código en tu email de confirmación
                        </p>
                    </div>
                </div>
            }
        />
    );
};

export default TrackOrderModal;
