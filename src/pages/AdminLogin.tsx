import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                    <div className="mb-10 text-center">
                        <div className="login-icon-box">
                            <ShieldCheck color="white" size={32} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#133882] tracking-tight">Admin Portal</h1>
                        <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
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
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-input"
                                    placeholder="••••••••"
                                />
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

                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    &copy; {new Date().getFullYear()} Manassanthi Hospitals. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
