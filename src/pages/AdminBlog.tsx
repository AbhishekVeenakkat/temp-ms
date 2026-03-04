import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Edit2, Plus, PenLine, Image as ImageIcon, X, ChevronRight, ArrowRight } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    description: string;
    content: string;
    photo_url: string;
    created_at: string;
}

const AdminBlog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (!error && data) setPosts(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let photo_url = editingPost?.photo_url || '';
            if (imageFile) {
                const fileName = `${Math.random()}.${imageFile.name.split('.').pop()}`;
                const filePath = `blogs/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
                photo_url = publicUrl;
            }
            const payload = { title: editingPost?.title, description: editingPost?.description, content: editingPost?.content, photo_url };
            if (editingPost?.id) {
                const { error } = await supabase.from('blogs').update(payload).eq('id', editingPost.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('blogs').insert(payload);
                if (error) throw error;
            }
            setEditingPost(null);
            setImageFile(null);
            setIsModalOpen(false);
            fetchBlogs();
            alert('Blog saved!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this blog?')) return;
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (!error) fetchBlogs();
    };

    const openNewModal = () => { setEditingPost({ title: '', description: '', content: '' }); setImageFile(null); setIsModalOpen(true); };
    const openEdit = (post: BlogPost) => { setEditingPost(post); setImageFile(null); setIsModalOpen(false); };
    const closeAll = () => { setEditingPost(null); setImageFile(null); setIsModalOpen(false); };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Inline edit view for existing posts */}
            {editingPost && !isModalOpen ? (
                <div className="admin-section" style={{ maxWidth: 960, margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#eff6ff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#133882' }}>
                                <PenLine size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#133882' }}>Edit Article</h3>
                                <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Update your article content below.</p>
                            </div>
                        </div>
                        <button onClick={closeAll} className="admin-modal-close"><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Article Title</label>
                                    <input type="text" required value={editingPost.title || ''} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} className="admin-input" style={{ fontWeight: 700, fontSize: 16 }} placeholder="The Future of Mental Wellness..." />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Brief Summary</label>
                                    <textarea required rows={4} value={editingPost.description || ''} onChange={e => setEditingPost({ ...editingPost, description: e.target.value })} className="admin-input" style={{ resize: 'none' }} placeholder="A short hook..." />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Featured Image</label>
                                    <label className="admin-modal-dropzone" style={{ height: 56 }}>
                                        <ImageIcon size={16} />
                                        <p style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{imageFile ? imageFile.name : (editingPost.photo_url ? 'Change image...' : 'Select cover...')}</p>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                    </label>
                                    {editingPost.photo_url && !imageFile && (
                                        <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', height: 100, border: '1px solid #f1f5f9' }}>
                                            <img src={editingPost.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label className="admin-form-label">Article Content</label>
                                <textarea required value={editingPost.content || ''} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} className="admin-input" style={{ flex: 1, minHeight: 420, fontFamily: 'serif', fontSize: 16, lineHeight: 1.8, padding: 24, resize: 'none' }} placeholder="Write your article here..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
                            <button type="button" onClick={closeAll} className="admin-btn admin-btn--ghost" style={{ padding: '12px 32px' }}>Cancel</button>
                            <button type="submit" disabled={saving} className="admin-btn admin-btn--primary" style={{ flex: 1, justifyContent: 'center', height: 52 }}>
                                {saving ? (
                                    <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /><span>Saving...</span></>
                                ) : (
                                    <><span>Save Changes</span><ChevronRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Editorial Content</p>
                            <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Manage articles and health insights.</p>
                        </div>
                        <button onClick={openNewModal} className="admin-btn admin-btn--primary" style={{ boxShadow: '0 8px 20px rgba(19,56,130,0.12)' }}>
                            <Plus size={18} /><span>Write New Article</span>
                        </button>
                    </div>

                    {/* Blog Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} style={{ height: 280, background: '#f1f5f9', borderRadius: 20 }} />)
                        ) : posts.map(post => (
                            <div key={post.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: 180, overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                                    <img src={post.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <span style={{ padding: '3px 10px', background: '#eff6ff', color: '#133882', fontSize: 10, fontWeight: 700, borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Article</span>
                                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <h4 style={{ fontSize: 17, fontWeight: 700, color: '#133882', lineHeight: 1.3, marginBottom: 8 }}>{post.title}</h4>
                                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.description}</p>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #f8fafc' }}>
                                        <button onClick={() => openEdit(post)} className="admin-btn admin-btn--ghost" style={{ flex: 1, justifyContent: 'center', background: '#f8fafc' }}>
                                            <Edit2 size={14} /><span>Edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} className="admin-btn admin-btn--danger admin-btn--icon" title="Delete"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* New Article Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-backdrop" onClick={() => !saving && closeAll()} />
                    <div className="admin-modal-box" style={{ maxWidth: 700 }}>
                        <div className="admin-modal-body">
                            <div className="admin-modal-header">
                                <div className="admin-modal-header__info">
                                    <div className="admin-modal-header__icon"><PenLine size={22} /></div>
                                    <div>
                                        <p className="admin-modal-header__title">New Article</p>
                                        <p className="admin-modal-header__subtitle">Draft a health insight or community update.</p>
                                    </div>
                                </div>
                                <button onClick={closeAll} className="admin-modal-close" disabled={saving}><X size={20} /></button>
                            </div>

                            <form id="blog-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="admin-modal-fields">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Article Title</label>
                                        <input type="text" required value={editingPost?.title || ''} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} className="admin-input" placeholder="The Future of Mental Wellness..." disabled={saving} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Brief Summary</label>
                                        <input type="text" required value={editingPost?.description || ''} onChange={e => setEditingPost({ ...editingPost, description: e.target.value })} className="admin-input" placeholder="A short hook for the blog list..." disabled={saving} />
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Article Content</label>
                                    <textarea required rows={8} value={editingPost?.content || ''} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} className="admin-input" style={{ resize: 'vertical', fontFamily: 'serif', fontSize: 16, lineHeight: 1.7 }} placeholder="Write your article here..." disabled={saving} />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Cover Image</label>
                                    <label className="admin-modal-dropzone" style={{ height: 56 }}>
                                        <ImageIcon size={16} />
                                        <p style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{imageFile ? imageFile.name : 'Select cover image...'}</p>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} disabled={saving} />
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="admin-modal-footer">
                            <button onClick={closeAll} className="admin-btn admin-btn--ghost" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>Cancel</button>
                            <button form="blog-form" type="submit" disabled={saving} className="admin-btn admin-btn--primary" style={{ flex: 2, justifyContent: 'center' }}>
                                {saving ? (
                                    <><div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /><span>Publishing...</span></>
                                ) : (
                                    <><span>Publish Article</span><ArrowRight size={17} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
