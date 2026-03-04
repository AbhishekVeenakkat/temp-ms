import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Youtube, ExternalLink, Link, X, Clock, ArrowRight, Newspaper } from 'lucide-react';

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

const Feed = () => {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);

    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedItem]);

    useEffect(() => {
        const fetchFeed = async () => {
            const { data, error } = await supabase.from('feed').select('*').order('created_at', { ascending: false });
            if (!error && data) setItems(data);
            setLoading(false);
        };
        fetchFeed();
    }, []);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="page-container">
            <header className="page-head">
                <div className="page-tag">
                    <div className="page-tag-dot">
                        <Newspaper size={11} color="#fff" fill="#fff" />
                    </div>
                    Latest Updates
                </div>
                <h1 className="page-title">
                    News & <strong>Updates</strong>
                </h1>
                <p className="page-subtitle">Stay informed about the latest happenings, health tips, and events at Manassanthi.</p>
            </header>

            <div className="feed-grid">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="feed-tile feed-tile--skeleton" />
                    ))
                ) : items.length > 0 ? (
                    items.map((item) => {
                        const ytThumb = getYouTubeThumbnail(item.youtube_link);
                        const coverSrc = ytThumb || item.image_url;

                        return (
                            <div
                                key={item.id}
                                className="feed-tile feed-tile--clickable"
                                onClick={() => setSelectedItem(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Thumbnail / Cover */}
                                <div className="feed-tile__media">
                                    {coverSrc ? (
                                        <img src={coverSrc} alt="Feed media" className="feed-tile__img" />
                                    ) : (
                                        <div className="feed-tile__placeholder" />
                                    )}
                                    {ytThumb && (
                                        <div className="feed-tile__play-btn">
                                            <div className="feed-tile__play-icon">
                                                <Youtube size={20} color="#dc2626" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Text */}
                                <div className="feed-tile__body">
                                    <span className="feed-tile__date">{formatDate(item.created_at)}</span>
                                    <p className="feed-tile__desc">{item.description}</p>
                                    {item.content && (
                                        <p className="feed-tile__content-preview">{item.content}</p>
                                    )}

                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 8 }}>
                                        <button className="feed-tile__more-btn" onClick={() => setSelectedItem(item)}>
                                            <span>Read More</span><ArrowRight size={13} />
                                        </button>
                                        {item.article_link && (
                                            <a
                                                href={item.article_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="feed-tile__link-btn feed-tile__link-btn--green"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span>Read Article</span><ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ gridColumn: '1/-1', padding: '80px 0', textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8' }}>The feed is quiet for now. Stay tuned!</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="admin-modal-overlay" style={{ zIndex: 1000 }}>
                    <div className="admin-modal-backdrop" onClick={() => setSelectedItem(null)} />
                    <div className="admin-modal-box" style={{ maxWidth: 800, padding: 0, overflow: 'hidden' }}>
                        <div className="admin-modal-body" style={{ padding: 0 }}>
                            {/* Media Header */}
                            <div style={{ position: 'relative', width: '100%', height: 350, background: '#000' }}>
                                <img
                                    src={getYouTubeThumbnail(selectedItem.youtube_link) || selectedItem.image_url}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div style={{ padding: '32px 40px 48px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#133882', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#eff6ff', padding: '4px 12px', borderRadius: 8 }}>Update</span>
                                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Clock size={14} /> {formatDate(selectedItem.created_at)}
                                    </span>
                                </div>

                                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 24 }}>{selectedItem.description}</h2>

                                {selectedItem.content && (
                                    <div style={{ color: '#475569', fontSize: 18, lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 32 }}>
                                        {selectedItem.content}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 32 }}>
                                    {selectedItem.youtube_link && (
                                        <a href={selectedItem.youtube_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: '#dc2626', color: 'white', borderRadius: 12, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)' }}>
                                            <Youtube size={20} /> Watch on YouTube
                                        </a>
                                    )}
                                    {selectedItem.article_link && (
                                        <a href={selectedItem.article_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: '#133882', color: 'white', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>
                                            Read Article <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feed;
