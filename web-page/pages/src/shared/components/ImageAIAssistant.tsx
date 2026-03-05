import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Crop, Maximize, Check, X, Wand2, Loader2 } from 'lucide-react';
import { analyzeImage, editImage } from '@/services/geminiService';

interface ImageAIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (imageUrl: string) => void;
    imageUrl: string;
}

const ImageAIAssistant: React.FC<ImageAIAssistantProps> = ({ isOpen, onClose, onApply, imageUrl }) => {
    const [currentImage, setCurrentImage] = useState(imageUrl);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'preview' | 'editing'>('preview');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setCurrentImage(imageUrl);
    }, [imageUrl]);

    if (!isOpen) return null;

    // Herramienta 1: Ajuste Maestro (Canvas 1:1)
    const handleMasterAdjust = async () => {
        setProcessing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = currentImage;

        img.onload = () => {
            const size = Math.max(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            if (ctx) {
                // Fondo transparente para PNG
                ctx.clearRect(0, 0, size, size);

                // Centrar imagen
                const x = (size - img.width) / 2;
                const y = (size - img.height) / 2;
                ctx.drawImage(img, x, y);

                const dataUrl = canvas.toDataURL('image/png');
                setCurrentImage(dataUrl);
            }
            setProcessing(false);
        };
    };

    // Herramienta 2: Eliminar Fondo (Gemini)
    const handleRemoveBackground = async () => {
        setProcessing(true);
        try {
            // Convert current image (DataURL or URL) to File
            const response = await fetch(currentImage);
            const blob = await response.blob();
            const file = new File([blob], "product.png", { type: "image/png" });

            const prompt = "Please remove the background of this product image. Ensure the edges are sharp. Return ONLY the product on a transparent background. Focus on the coffee product and its base if present.";
            const result = await editImage(file, prompt);

            if (result) {
                setCurrentImage(result);
            }
        } catch (error) {
            console.error("AI Assistant Error:", error);
            alert("Error con la IA: Asegúrate de que la API KEY esté configurada.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-fade-in">
            <div className="bg-[#0A0F0C] border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">

                {/* Visual Area */}
                <div className="flex-1 bg-black/40 p-8 flex items-center justify-center relative overflow-hidden pattern-dots">
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="relative group perspective-1000">
                        {/* Fake Portal Preview */}
                        <div className="absolute inset-0 border-2 border-dashed border-[#C8AA6E]/30 rounded-full scale-105 pointer-events-none group-hover:border-[#C8AA6E]/60 transition-all duration-700"></div>

                        <img
                            src={currentImage}
                            alt="Preview"
                            className={`max-w-full max-h-[50vh] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ${processing ? 'opacity-30 blur-sm' : ''}`}
                        />

                        {processing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-[#C8AA6E]" size={48} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8AA6E] animate-pulse">Procesando con IA...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Area */}
                <div className="w-full md:w-80 bg-white/[0.02] border-l border-white/10 p-8 flex flex-col justify-between">
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-[#C8AA6E]">
                                <Sparkles size={16} />
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">IA Assistant Pop-out</h3>
                            </div>
                            <h2 className="text-2xl font-serif text-white">Optimizar Imagen</h2>
                            <p className="text-white/40 text-xs mt-2 leading-relaxed">Prepara tu producto para el efecto de profundidad milimétrico.</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleMasterAdjust}
                                disabled={processing}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C8AA6E]/50 hover:bg-[#C8AA6E]/5 transition-all text-left group"
                            >
                                <div className="p-3 rounded-lg bg-white/5 text-[#C8AA6E] group-hover:scale-110 transition-transform">
                                    <Maximize size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ajuste Maestro</h4>
                                    <p className="text-[10px] text-white/40">Escala 1:1 para el portal</p>
                                </div>
                            </button>

                            <button
                                onClick={handleRemoveBackground}
                                disabled={processing}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#C8AA6E]/20 to-transparent border border-[#C8AA6E]/30 hover:border-[#C8AA6E] transition-all text-left group"
                            >
                                <div className="p-3 rounded-lg bg-[#C8AA6E] text-black group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(200,170,110,0.4)]">
                                    <Wand2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quitar Fondo IA</h4>
                                    <p className="text-[10px] text-white/40 font-serif italic text-[#C8AA6E]/80">Tecnología Gemini Nano</p>
                                </div>
                            </button>
                        </div>

                        <div className="bg-[#C8AA6E]/5 border border-[#C8AA6E]/20 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Sparkles className="text-[#C8AA6E] shrink-0" size={14} />
                                <p className="text-[10px] text-white/60 leading-relaxed">
                                    <span className="text-[#C8AA6E] font-bold uppercase block mb-1">Tip Experto:</span>
                                    Asegúrate de que la parte superior del producto esté bien definida para el efecto de profundidad.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onApply(currentImage)}
                            disabled={processing}
                            className="flex-1 px-4 py-3 rounded-xl bg-[#C8AA6E] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4B075] transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={14} />
                            Aplicar
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default ImageAIAssistant;
