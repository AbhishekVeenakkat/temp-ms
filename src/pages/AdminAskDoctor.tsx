import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, MessageCircleHeart, X, Calendar, User, Mail, Phone, FileText, Eye } from 'lucide-react';

interface AskDoctorEntry {
    id: string;
    created_at: string;
    question: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    admin_notes: string | null;
}

const AdminAskDoctor = () => {
    const [entries, setEntries] = useState<AskDoctorEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<AskDoctorEntry | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { fetchEntries(); }, []);

    const fetchEntries = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('ask_doctor')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setEntries(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this inquiry?')) return;
        setDeleting(true);
        const { error } = await supabase.from('ask_doctor').delete().eq('id', id);
        if (!error) {
            fetchEntries();
            if (selectedEntry?.id === id) setSelectedEntry(null);
        }
        setDeleting(false);
    };

    const getFirstLine = (text: string) => {
        const firstLine = text.split('\n')[0];
        return firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Patient Inquiries</p>
                    <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                        {entries.length} {entries.length === 1 ? 'question' : 'questions'} submitted
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ height: 90, background: '#f1f5f9', borderRadius: 16 }} />
                        ))}
                    </div>
                ) : entries.length === 0 ? (
                    <div className="admin-card" style={{ padding: 60, textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageCircleHeart size={32} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>No Questions Yet</h3>
                        <p style={{ fontSize: 14, color: '#94a3b8' }}>Patient inquiries will appear here.</p>
                    </div>
                ) : (
                    entries.map(entry => {
                        return (
                            <div 
                                key={entry.id} 
                                className="admin-card" 
                                style={{ 
                                    display: 'flex',
                                    padding: 20,
                                    gap: 16,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => setSelectedEntry(entry)}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Calendar size={12} />
                                            {new Date(entry.created_at).toLocaleDateString(undefined, { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} at {new Date(entry.created_at).toLocaleTimeString(undefined, {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                        {entry.name && (
                                            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                                                • {entry.name}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ 
                                        fontSize: 14,
                                        color: '#334155',
                                        lineHeight: 1.5,
                                        fontWeight: 500
                                    }}>
                                        {getFirstLine(entry.question)}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEntry(entry);
                                        }}
                                        className="admin-btn admin-btn--ghost admin-btn--icon"
                                        title="View"
                                        style={{ background: '#f8fafc' }}
                                    >
                                        <Eye size={15} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(entry.id);
                                        }}
                                        className="admin-btn admin-btn--danger admin-btn--icon"
                                        title="Delete"
                                        disabled={deleting}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail Modal */}
            {selectedEntry && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-backdrop" onClick={() => setSelectedEntry(null)} />
                    <div className="admin-modal-box" style={{ maxWidth: 700 }}>
                        <div className="admin-modal-body">
                            <div className="admin-modal-header">
                                <div className="admin-modal-header__info">
                                    <div className="admin-modal-header__icon">
                                        <MessageCircleHeart size={22} />
                                    </div>
                                    <div>
                                        <p className="admin-modal-header__title">Patient Inquiry</p>
                                        <p className="admin-modal-header__subtitle">
                                            Submitted on {new Date(selectedEntry.created_at).toLocaleDateString(undefined, { 
                                                month: 'long', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} at {new Date(selectedEntry.created_at).toLocaleTimeString(undefined, {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedEntry(null)} 
                                    className="admin-modal-close"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Contact Information */}
                                {(selectedEntry.name || selectedEntry.email || selectedEntry.phone) && (
                                    <div style={{ 
                                        background: '#f8fafc',
                                        borderRadius: 12,
                                        padding: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 10
                                    }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                                            Contact Information
                                        </p>
                                        {selectedEntry.name && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <User size={14} color="#64748b" />
                                                <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>
                                                    {selectedEntry.name}
                                                </span>
                                            </div>
                                        )}
                                        {selectedEntry.email && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Mail size={14} color="#64748b" />
                                                <a 
                                                    href={`mailto:${selectedEntry.email}`}
                                                    style={{ fontSize: 13, color: '#133882', fontWeight: 500, textDecoration: 'none' }}
                                                >
                                                    {selectedEntry.email}
                                                </a>
                                            </div>
                                        )}
                                        {selectedEntry.phone && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Phone size={14} color="#64748b" />
                                                <a 
                                                    href={`tel:${selectedEntry.phone}`}
                                                    style={{ fontSize: 13, color: '#133882', fontWeight: 500, textDecoration: 'none' }}
                                                >
                                                    {selectedEntry.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Question */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <FileText size={16} color="#64748b" />
                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            Question
                                        </p>
                                    </div>
                                    <div style={{
                                        background: 'white',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: 12,
                                        padding: 20,
                                        fontSize: 14,
                                        color: '#334155',
                                        lineHeight: 1.7,
                                        whiteSpace: 'pre-wrap',
                                        fontWeight: 500
                                    }}>
                                        {selectedEntry.question}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <button 
                                onClick={() => handleDelete(selectedEntry.id)}
                                className="admin-btn admin-btn--danger"
                                style={{ justifyContent: 'center' }}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        <span>Delete Inquiry</span>
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={() => setSelectedEntry(null)}
                                className="admin-btn admin-btn--ghost"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAskDoctor;
