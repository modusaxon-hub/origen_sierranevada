import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SystemFeedbackProps {
    message: string | null;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const SystemFeedback: React.FC<SystemFeedbackProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // Wait for animation to finish
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message && !visible) return null;

    const styles = {
        success: {
            bg: 'bg-emerald-900/90',
            border: 'border-emerald-500/30',
            text: 'text-emerald-200',
            icon: <CheckCircle className="text-emerald-400" size={20} />
        },
        error: {
            bg: 'bg-red-900/90',
            border: 'border-red-500/30',
            text: 'text-red-200',
            icon: <XCircle className="text-red-400" size={20} />
        },
        info: {
            bg: 'bg-blue-900/90',
            border: 'border-blue-500/30',
            text: 'text-blue-200',
            icon: <AlertCircle className="text-blue-400" size={20} />
        }
    };

    const currentStyle = styles[type];

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 transform ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md border ${currentStyle.bg} ${currentStyle.border}`}>
                {currentStyle.icon}
                <span className={`text-sm font-medium ${currentStyle.text}`}>{message}</span>
                <button
                    onClick={() => setVisible(false)}
                    className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
                >
                    <span className="material-icons-outlined text-sm text-white">close</span>
                </button>
            </div>
        </div>
    );
};

export default SystemFeedback;
