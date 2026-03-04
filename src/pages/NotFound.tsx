import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}>
            <div style={{
                fontSize: '120px',
                fontWeight: '900',
                color: '#133882',
                lineHeight: '1',
                marginBottom: '20px',
                opacity: '0.1',
                position: 'absolute',
                userSelect: 'none'
            }}>
                404
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    color: '#0f172a',
                    marginBottom: '16px',
                    letterSpacing: '-0.02em'
                }}>
                    Page Not Found
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: '#64748b',
                    maxWidth: '480px',
                    margin: '0 auto 40px',
                    lineHeight: '1.6'
                }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="admin-btn admin-btn--ghost"
                        style={{ padding: '12px 24px' }}
                    >
                        <ArrowLeft size={18} />
                        <span>Go Back</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="admin-btn admin-btn--primary"
                        style={{ padding: '12px 24px', boxShadow: '0 10px 25px rgba(19, 56, 130, 0.15)' }}
                    >
                        <Home size={18} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
