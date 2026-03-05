import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Image as ImageIcon, X } from 'lucide-react';

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

const Media = () => {
    const [groups, setGroups] = useState<MediaGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

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
        const fetchMedia = async () => {
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

        fetchMedia();
    }, []);

    return (
        <div className="page-container">
            <header className="page-head">
                <div className="page-tag">
                    <div className="page-tag-dot">
                        <ImageIcon size={11} color="#fff" fill="#fff" />
                    </div>
                    Gallery
                </div>
                <h1 className="page-title">
                    Media <strong>Gallery</strong>
                </h1>
                <p className="page-subtitle">A collection of moments and facilities at Manassanthi Hospitals.</p>
            </header>

            <div className="media-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {loading ? (
                    <div className="media-grid" style={{ padding: 0 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="media-card animate-pulse">
                                <div className="media-card__content bg-zinc-800" />
                            </div>
                        ))}
                    </div>
                ) : groups.length > 0 ? (
                    groups.map((group) => (
                        <div key={group.caption_id} style={{ marginBottom: '24px' }}>
                            {group.caption && (
                                <div style={{ marginBottom: '20px' }}>
                                    <h2 style={{ 
                                        fontSize: '24px', 
                                        fontWeight: 700, 
                                        color: 'var(--color-primary)',
                                        marginBottom: '8px'
                                    }}>
                                        {group.caption}
                                    </h2>
                                    {group.description && (
                                        <p style={{ 
                                            fontSize: '15px', 
                                            color: 'var(--color-muted)',
                                            lineHeight: 1.6
                                        }}>
                                            {group.description}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="media-grid" style={{ padding: 0 }}>
                                {group.items.map((item) => (
                                    <div key={item.id} className="media-card" onClick={() => setSelectedItem(item)}>
                                        <div className="media-card__content">
                                            {item.type === 'video' ? (
                                                <div style={{}}>
                                                    <video src={item.url} className="media-card__img" style={{
                                                        height: "100%"
                                                    }} muted preload="metadata" />
                                                    <Play size={48} color="#ffffff00" fill="#ffffff" style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        pointerEvents: 'none',
                                                    }} />
                                                </div>
                                            ) : (
                                                <img src={item.url} alt={item.caption} className="media-card__img" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-gray-500">No media found. Check back later!</p>
                    </div>
                )}
            </div>

            {selectedItem && (
                <div className="media-modal" onClick={() => setSelectedItem(null)}>
                    <div className="media-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="media-modal__close" onClick={() => setSelectedItem(null)}>
                            <X size={24} />
                        </button>
                        <div className="media-modal__media">
                            {selectedItem.type === 'video' ? (
                                <video src={selectedItem.url} controls autoPlay className="media-modal__video" />
                            ) : (
                                <img src={selectedItem.url} alt={selectedItem.caption} className="media-modal__img" />
                            )}
                        </div>
                        <div className="media-modal__info">
                            <h2 className="media-modal__caption">{selectedItem.caption || 'Gallery Item'}</h2>
                            {selectedItem.description && <p className="media-modal__desc">{selectedItem.description}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;
