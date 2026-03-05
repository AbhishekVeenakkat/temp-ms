import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
}

function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        info: <Info size={20} />,
        warning: <AlertCircle size={20} />
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    return (
        <div className="toast" style={{ borderLeft: `4px solid ${colors[type]}` }}>
            <div className="toast-icon" style={{ color: colors[type] }}>
                {icons[type]}
            </div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>

            <style>{`
                .toast {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .toast-icon {
                    flex-shrink: 0;
                }

                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    color: #333;
                    font-weight: 500;
                }

                .toast-close {
                    flex-shrink: 0;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .toast-close:hover {
                    background: rgba(0, 0, 0, 0.05);
                }

                @media (max-width: 768px) {
                    .toast {
                        top: 20px;
                        right: 20px;
                        left: 20px;
                        min-width: unset;
                        max-width: unset;
                    }
                }
            `}</style>
        </div>
    );
}

export default Toast;
