import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Trash2, Edit2, Image as ImageIcon, Film, Plus, ArrowRight, Eye } from 'lucide-react';

interface MediaItem {
    id: string;
    url: string;
    type: string;
    description: string;
    caption: string;
    caption_id: string;
    created_at: string;
}

interface MediaGroup {
    caption_id: string;
    caption: string;
    description: string;
    items: MediaItem[];
    created_at: string;
}

const AdminMedia = () => {
    const [groups, setGroups] = useState<MediaGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

    // Form state
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Group items by caption_id
            const groupedMap = new Map<string, MediaGroup>();
            
            data.forEach((item: MediaItem) => {
                const groupId = item.caption_id || item.id;
                
                if (!groupedMap.has(groupId)) {
                    groupedMap.set(groupId, {
                        caption_id: groupId,
                        caption: item.caption,
                        description: item.description,
                        items: [],
                        created_at: item.created_at
                    });
                }
                
                groupedMap.get(groupId)!.items.push(item);
            });
            
            // Convert to array and sort by created_at
            const groupedArray = Array.from(groupedMap.values()).sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            
            setGroups(groupedArray);
        }
        setLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setStagedFiles(prev => [...prev, ...newFiles]);
    };

    const removeStagedFile = (index: number) => {
        setStagedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleConfirmUpload = async () => {
        if (stagedFiles.length === 0) return;
        setUploading(true);

        const captionId = crypto.randomUUID();

        try {
            for (const file of stagedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath);

                const isVideo = file.type.startsWith('video');
                const { error: dbError } = await supabase
                    .from('gallery')
                    .insert({
                        url: publicUrl,
                        type: isVideo ? 'video' : 'image',
                        caption: caption,
                        description: description,
                        caption_id: captionId
                    });

                if (dbError) throw dbError;
            }

            setCaption('');
            setDescription('');
            setStagedFiles([]);
            setIsModalOpen(false);
            fetchMedia();
            alert('Upload successful!');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (item: MediaItem) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error: dbError } = await supabase
                .from('gallery')
                .delete()
                .eq('id', item.id);

            if (dbError) throw dbError;

            const fileName = item.url.split('/').pop();
            await supabase.storage
                .from('media')
                .remove([`gallery/${fileName}`]);

            fetchMedia();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="admin-btn admin-btn--primary shadow-lg shadow-blue-900/10"
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    <Upload size={18} />
                    <span>Post New Media</span>
                </button>
            </div>

            {/* Gallery Grid - grouped by upload */}
            <div className="admin-media-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                    {loading ? (
                        <div className="admin-media-grid">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="admin-media-thumbnail" style={{ background: '#f1f5f9' }} />
                            ))}
                        </div>
                    ) : groups.map(group => (
                        <div key={group.caption_id}>
                            {group.caption && (
                                <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid #f1f5f9' }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#133882', marginBottom: 6 }}>
                                        {group.caption}
                                    </h3>
                                    {group.description && (
                                        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                                            {group.description}
                                        </p>
                                    )}
                                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 4, display: 'block' }}>
                                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                            )}
                            <div className="admin-media-grid">
                            {group.items.map(item => (
                    <div key={item.id} className="admin-media-thumbnail">
                        {item.type === 'video' ? (
                            <div className="admin-media-thumbnail__video-placeholder">
                                <Film size={20} />
                                <span>Video</span>
                            </div>
                        ) : (
                            <img src={item.url} alt={item.caption || ''} />
                        )}
                        <div className="admin-media-thumbnail__overlay">
                            <div className="admin-media-thumbnail__actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewItem(item);
                                    }}
                                    className="admin-media-thumbnail__btn admin-media-thumbnail__btn--preview"
                                    title="Preview"
                                >
                                    <Eye size={15} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item);
                                    }}
                                    className="admin-media-thumbnail__btn admin-media-thumbnail__btn--delete"
                                    title="Delete"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <div className="admin-media-thumbnail__info">
                                {item.caption && (
                                    <div className="admin-media-thumbnail__caption">{item.caption}</div>
                                )}
                                {item.description && (
                                    <div className="admin-media-thumbnail__description">{item.description}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-backdrop" onClick={() => !uploading && setIsModalOpen(false)} />
                    <div className="admin-modal-box">
                        <div className="admin-modal-body">
                            <div className="admin-modal-header">
                                <div className="admin-modal-header__info">
                                    <div className="admin-modal-header__icon">
                                        <ImageIcon size={24} />
                                    </div>
                                    <div>
                                        <p className="admin-modal-header__title">Library Submission</p>
                                        <p className="admin-modal-header__subtitle">Add new visual assets to the gallery.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="admin-modal-close"
                                    disabled={uploading}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="admin-modal-fields">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Media Caption</label>
                                    <input
                                        type="text"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="admin-input"
                                        placeholder="Event or Scene Title"
                                        disabled={uploading}
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Brief Description</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="admin-input"
                                        placeholder="Add context (optional)"
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <label className="admin-modal-dropzone">
                                <Plus size={20} />
                                <p>Click to Add Files</p>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                    disabled={uploading}
                                />
                            </label>

                            {stagedFiles.length > 0 && (
                                <div className="admin-staged-grid" style={{ marginTop: '12px' }}>
                                    {stagedFiles.map((file, idx) => (
                                        <div key={idx} className="admin-staged-item">
                                            {file.type.startsWith('image') ? (
                                                <img src={URL.createObjectURL(file)} alt="" />
                                            ) : (
                                                <div className="admin-media-thumbnail__video-placeholder">
                                                    <Film size={16} />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => removeStagedFile(idx)}
                                                className="admin-staged-item__remove"
                                                disabled={uploading}
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="admin-modal-footer">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="admin-btn admin-btn--ghost"
                                style={{ flex: 1, justifyContent: 'center' }}
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmUpload}
                                disabled={uploading || stagedFiles.length === 0}
                                className="admin-btn admin-btn--primary"
                                style={{ flex: 2, justifyContent: 'center' }}
                            >
                                {uploading ? (
                                    <>
                                        <div style={{
                                            width: 16, height: 16,
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation: 'spin 0.7s linear infinite'
                                        }} />
                                        <span>Uploading {stagedFiles.length} items...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Upload</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <div className="admin-modal-overlay" onClick={() => setPreviewItem(null)}>
                    <div className="admin-modal-backdrop" />
                    <div 
                        className="admin-modal-box" 
                        style={{ maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal-body" style={{ padding: 0 }}>
                            {previewItem.type === 'video' ? (
                                <video 
                                    src={previewItem.url} 
                                    controls
                                    style={{ 
                                        width: '100%', 
                                        maxHeight: '70vh',
                                        display: 'block',
                                        backgroundColor: '#000'
                                    }}
                                />
                            ) : (
                                <img 
                                    src={previewItem.url} 
                                    alt={previewItem.caption || ''}
                                    style={{ 
                                        width: '100%', 
                                        maxHeight: '70vh',
                                        objectFit: 'contain',
                                        display: 'block',
                                        backgroundColor: '#000'
                                    }}
                                />
                            )}
                            {(previewItem.caption || previewItem.description) && (
                                <div style={{ padding: 24, borderTop: '1px solid #f1f5f9' }}>
                                    {previewItem.caption && (
                                        <h3 style={{ 
                                            fontSize: 18, 
                                            fontWeight: 700, 
                                            color: '#133882',
                                            marginBottom: 8 
                                        }}>
                                            {previewItem.caption}
                                        </h3>
                                    )}
                                    {previewItem.description && (
                                        <p style={{ 
                                            fontSize: 14, 
                                            color: '#64748b',
                                            lineHeight: 1.6 
                                        }}>
                                            {previewItem.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button 
                                onClick={() => setPreviewItem(null)}
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

export default AdminMedia;
