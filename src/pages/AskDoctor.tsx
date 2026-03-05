import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleHeart, User, Mail, Phone, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Toast from '../components/Toast';

function AskDoctor() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        question: '',
        name: '',
        email: '',
        phone: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('ask_doctor')
                .insert({
                    question: formData.question,
                    name: formData.name || null,
                    email: formData.email || null,
                    phone: formData.phone || null,
                    status: 'pending'
                });

            if (error) throw error;

            // Show success toast and redirect to home
            setToast({ message: 'Question submitted successfully!', type: 'success' });
            
            // Navigate to home after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error: any) {
            setToast({ message: error.message || 'Failed to submit question', type: 'error' });
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="page-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            
            <header className="page-head">
                <div className="page-tag">
                    <div className="page-tag-dot">
                        <MessageCircleHeart size={11} color="#fff" fill="#fff" />
                    </div>
                    Anonymous Consultation
                </div>
                <h1 className="page-title">
                    Got a health concern? <strong>Ask right away.</strong>
                </h1>
                <p className="page-subtitle">
                    Submit your questions anonymously and receive expert replies through blog posts, phone calls, or email.
                    Our team of experienced psychiatrists is here to help.
                </p>
            </header>

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="ask-doctor-form-card">
                    <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="question" className="form-label">
                                    Your Question or Concern <span style={{ color: '#e74c3c' }}>*</span>
                                </label>
                                <textarea
                                    id="question"
                                    name="question"
                                    className="form-textarea"
                                    rows={6}
                                    placeholder="Please describe your health concern or question in detail..."
                                    value={formData.question}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Name <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span>
                                    </label>
                                    <div className="form-input-wrapper">
                                        <User size={18} className="form-input-icon" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className="form-input"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">
                                        Phone <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span>
                                    </label>
                                    <div className="form-input-wrapper">
                                        <Phone size={18} className="form-input-icon" />
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            className="form-input"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span>
                                </label>
                                <div className="form-input-wrapper">
                                    <Mail size={18} className="form-input-icon" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-input"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                                <strong>Privacy Note:</strong> All fields except your question are optional. You can submit anonymously 
                                without providing any contact information. If you do provide contact details, we'll use them only to 
                                respond to your specific inquiry.
                            </p>

                            <button
                                type="submit"
                                className="form-submit-btn"
                                disabled={submitting || !formData.question.trim()}
                            >
                                {submitting ? (
                                    <>
                                        <div className="spinner" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Question
                                    </>
                                )}
                            </button>
                        </form>
                </div>
            </div>

            <style>{`
                .ask-doctor-form-card {
                    background: white;
                    border-radius: 20px;
                    padding: 48px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(19, 56, 130, 0.08);
                }

                .form-group {
                    margin-bottom: 24px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--color-primary);
                    margin-bottom: 8px;
                }

                .form-input-wrapper {
                    position: relative;
                }

                .form-input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-muted);
                    pointer-events: none;
                }

                .form-input {
                    width: 100%;
                    padding: 14px 16px 14px 48px;
                    border: 2px solid rgba(19, 56, 130, 0.15);
                    border-radius: 12px;
                    font-size: 15px;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    font-family: inherit;
                    background: white;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--color-accent-2);
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-textarea {
                    width: 100%;
                    padding: 16px;
                    border: 2px solid rgba(19, 56, 130, 0.15);
                    border-radius: 12px;
                    font-size: 15px;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    font-family: inherit;
                    resize: vertical;
                    background: white;
                    line-height: 1.6;
                }

                .form-textarea:focus {
                    outline: none;
                    border-color: var(--color-accent-2);
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-submit-btn {
                    width: 100%;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: transform 0.2s ease, box-shadow 0.3s ease;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .form-submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }

                .form-submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .form-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .ask-doctor-form-card {
                        padding: 32px 24px;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AskDoctor;
