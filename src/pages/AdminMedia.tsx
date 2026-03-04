import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Trash2, Edit2, Image as ImageIcon, Film, Plus, ArrowRight } from 'lucide-react';

interface MediaItem {
    id: string;
    url: string;
    type: string;
    description: string;
    caption: string;
    created_at: string;
}

const AdminMedia = () => {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        if (!error && data) setItems(data);
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

            {/* Gallery Grid - using custom CSS class */}
            <div className="admin-media-grid">
                {loading ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="admin-media-thumbnail" style={{ background: '#f1f5f9' }} />
                    ))
                ) : items.map(item => (
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
                            <button
                                onClick={() => handleDelete(item)}
                                className="admin-media-thumbnail__delete"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
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
        </div>
    );
};

export default AdminMedia;
