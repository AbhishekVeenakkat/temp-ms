import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Youtube, Clock, Plus, Image as ImageIcon, X, ArrowRight, ExternalLink, Edit2, Link, FileText } from 'lucide-react';

interface FeedItem {
    id: string;
    image_url: string;
    description: string;
    youtube_link: string;
    article_link: string;
    content: string;
    created_at: string;
}

const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
};

const getYouTubeThumbnail = (url: string): string | null => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

const AdminFeed = () => {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [articleLink, setArticleLink] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => { fetchFeed(); }, []);

    const fetchFeed = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('feed').select('*').order('created_at', { ascending: false });
        if (!error && data) setItems(data);
        setLoading(false);
    };

    const openNew = () => {
        setEditingId(null);
        setDescription('');
        setYoutubeLink('');
        setArticleLink('');
        setContent('');
        setImageFile(null);
        setIsModalOpen(true);
    };

    const openEdit = (item: FeedItem) => {
        setEditingId(item.id);
        setDescription(item.description || '');
        setYoutubeLink(item.youtube_link || '');
        setArticleLink(item.article_link || '');
        setContent(item.content || '');
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let imageUrl = editingId ? (items.find(i => i.id === editingId)?.image_url || '') : '';

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `feed/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
                imageUrl = publicUrl;
            }

            const payload = {
                description,
                youtube_link: youtubeLink,
                article_link: articleLink,
                content,
                ...(imageUrl && { image_url: imageUrl }),
            };

            if (editingId) {
                // Use RPC to bypass CORS PATCH issues
                const { error } = await supabase.rpc('update_feed_item', {
                    item_id: editingId,
                    new_description: payload.description,
                    new_youtube_link: payload.youtube_link,
                    new_article_link: payload.article_link,
                    new_content: payload.content
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.from('feed').insert({ ...payload, image_url: imageUrl });
                if (error) throw error;
            }

            closeModal();
            fetchFeed();
            alert(editingId ? 'Post updated!' : 'Post created!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: FeedItem) => {
        if (!confirm('Delete this post?')) return;
        const { error } = await supabase.from('feed').delete().eq('id', item.id);
        if (!error) fetchFeed();
    };

    const ytThumbPreview = getYouTubeThumbnail(youtubeLink);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#133882', marginBottom: 4 }}>Community Feed</h2>
                    <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Manage your social feed and community updates.</p>
                </div>
                <button onClick={openNew} className="admin-btn admin-btn--primary">
                    <Plus size={18} /><span>New Post</span>
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Recent Posts</p>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2].map(i => (<div key={i} style={{ height: 110, background: '#f1f5f9', borderRadius: 20 }} />))}
                    </div>
                ) : items.map(item => {
                    const ytThumb = getYouTubeThumbnail(item.youtube_link);
                    const coverSrc = ytThumb || item.image_url;
                    return (
                        <div key={item.id} className="admin-card" style={{ display: 'flex', padding: 0, overflow: 'hidden' }}>
                            {coverSrc && (
                                <div style={{ position: 'relative', width: 140, flexShrink: 0 }}>
                                    <img src={coverSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {ytThumb && (
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Youtube size={16} color="#dc2626" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={() => openEdit(item)} className="admin-btn admin-btn--ghost admin-btn--icon"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(item)} className="admin-btn admin-btn--danger admin-btn--icon"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.5, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {item.youtube_link && <span style={{ padding: '2px 8px', background: '#fff1f2', color: '#dc2626', fontSize: 10, fontWeight: 700, borderRadius: 6 }}>Video</span>}
                                    {item.article_link && <span style={{ padding: '2px 8px', background: '#f0fdf4', color: '#16a34a', fontSize: 10, fontWeight: 700, borderRadius: 6 }}>Link</span>}
                                    {item.content && <span style={{ padding: '2px 8px', background: '#f8fafc', color: '#64748b', fontSize: 10, fontWeight: 700, borderRadius: 6 }}>Details</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-backdrop" onClick={closeModal} />
                    <div className="admin-modal-box" style={{ maxWidth: 640 }}>
                        <div className="admin-modal-body">
                            <div className="admin-modal-header">
                                <div className="admin-modal-header__info">
                                    <div className="admin-modal-header__icon">{editingId ? <Edit2 size={20} /> : <Plus size={22} />}</div>
                                    <div>
                                        <p className="admin-modal-header__title">{editingId ? 'Edit Post' : 'New Post'}</p>
                                        <p className="admin-modal-header__subtitle">Items with longer "Detailed Content" will show a "Read More" button on the grid.</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="admin-modal-close" disabled={saving}><X size={20} /></button>
                            </div>

                            <form id="feed-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Brief Description (Shows on Grid - 2 lines approx)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={2}
                                        className="admin-input"
                                        style={{ resize: 'none' }}
                                        placeholder="Write a clear, short summary for the grid view..."
                                        disabled={saving}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Detailed Content (Dialog / Optional)</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={6}
                                        className="admin-input"
                                        style={{ resize: 'vertical' }}
                                        placeholder="Additional paragraphs that appear when a user clicks the card or 'Read More'..."
                                        disabled={saving}
                                    />
                                </div>

                                <div className="admin-modal-fields">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label"><Youtube size={13} color="#dc2626" /> YouTube URL</label>
                                        <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="admin-input" placeholder="https://youtube.com..." disabled={saving} />
                                        {ytThumbPreview && (
                                            <div style={{ marginTop: 6, borderRadius: 8, overflow: 'hidden', height: 70, border: '1px solid #f1f5f9' }}>
                                                <img src={ytThumbPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label"><Link size={13} color="#16a34a" /> External Link</label>
                                        <input type="url" value={articleLink} onChange={(e) => setArticleLink(e.target.value)} className="admin-input" placeholder="https://..." disabled={saving} />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label"><ImageIcon size={13} color="#3b82f6" /> Attachment</label>
                                    <label className="admin-modal-dropzone" style={{ height: 50 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>{imageFile ? imageFile.name : (editingId ? 'Change image...' : 'Select image...')}</span>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setImageFile(e.target.files?.[0] || null)} disabled={saving} />
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="admin-modal-footer">
                            <button onClick={closeModal} className="admin-btn admin-btn--ghost" disabled={saving}>Cancel</button>
                            <button form="feed-form" type="submit" disabled={saving} className="admin-btn admin-btn--primary" style={{ flex: 1, justifyContent: 'center' }}>
                                {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Publish Post')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeed;
