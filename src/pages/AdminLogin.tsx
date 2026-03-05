import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-blob login-blob--1"></div>
            <div className="login-blob login-blob--2"></div>

            <div className="w-full max-w-[440px] px-6 relative z-10">
                <div className="login-card">
                    <div className="text-center" style={{ marginBottom: '40px' }}>
                        <div className="login-icon-box">
                            <ShieldCheck color="white" size={34} strokeWidth={2.5} />
                        </div>
                        <h1 style={{ 
                            fontSize: '32px', 
                            fontWeight: 900, 
                            color: '#133882', 
                            letterSpacing: '0.02em',
                            marginBottom: '8px',
                            lineHeight: 1
                        }}>
                            MANASSANTHI
                        </h1>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            marginBottom: '12px'
                        }}>
                            Admin Portal
                        </div>
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#64748b',
                            fontWeight: 500,
                            lineHeight: 1.5
                        }}>
                            Secure access to management dashboard
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <div className="login-input-group">
                            <label className="login-label">Email Address</label>
                            <div className="login-input-wrapper">
                                <Mail className="login-input-icon" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="login-input"
                                    placeholder="john@manassanthi.com"
                                />
                            </div>
                        </div>

                        <div className="login-input-group">
                            <label className="login-label">Secure Password</label>
                            <div className="login-input-wrapper">
                                <Lock className="login-input-icon" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-input login-input--password"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="login-password-toggle"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
