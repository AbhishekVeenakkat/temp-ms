import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Image as ImageIcon, X } from 'lucide-react';

interface MediaItem {
    id: string;
    url: string;
    type: string;
    description: string;
    caption: string;
}

const Media = () => {
    const [items, setItems] = useState<MediaItem[]>([]);
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
                setItems(data);
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

            <div className="media-grid">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="media-card animate-pulse">
                            <div className="media-card__content bg-zinc-800" />
                            <div className="media-card__info">
                                <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                                <div className="h-3 bg-zinc-800 rounded w-3/4" />
                            </div>
                        </div>
                    ))
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="media-card" onClick={() => setSelectedItem(item)}>
                            <div className="media-card__content">
                                {item.type === 'video' ? (
                                    <div className="relative w-full h-full">
                                        <video src={item.url} className="media-card__img" muted />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/40 transition-colors cursor-pointer">
                                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                                                <Play className="text-white fill-white" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <img src={item.url} alt={item.caption} className="media-card__img" />
                                )}
                            </div>
                            <div className="media-card__info">
                                <h3 className="media-card__caption">{item.caption || 'Gallery Item'}</h3>
                                {item.description && <p className="media-card__desc">{item.description}</p>}
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
