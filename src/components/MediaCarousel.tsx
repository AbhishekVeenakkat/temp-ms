import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Play, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
    id: string;
    url: string;
    type: string;
    caption: string;
}

const MediaCarousel = () => {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            const { data, error } = await supabase
                .from('gallery')
                .select('id, url, type, caption')
                .order('created_at', { ascending: false })
                .limit(4);

            if (!error && data) {
                setItems(data);
            }
            setLoading(false);
        };

        fetchMedia();
    }, []);

    if (loading) {
        return (
            <div className="media-carousel-loading">
                <div className="media-carousel-skeleton-track">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="media-carousel-skeleton-card" />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    // Duplicate items to create infinite loop effect
    const displayItems = [...items, ...items, ...items];

    return (
        <section className="media-carousel-section">
            <div className="media-carousel-container">
                <div className="media-carousel-header">
                    <div className="hero__tag" style={{ margin: 0 }}>
                        <div className="hero__tag-dot" style={{ background: 'var(--color-accent-2)' }}>
                            <ImageIcon size={11} color="#fff" fill="#fff" />
                        </div>
                        Media Gallery
                    </div>
                    <Link to="/media" className="media-carousel-more">
                        <span>View Gallery</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="media-carousel-track-wrapper">
                    <div className="media-carousel-track">
                        {displayItems.map((item, index) => (
                            <Link to="/media" key={`${item.id}-${index}`} className="media-carousel-card">
                                <div className="media-carousel-media">
                                    {item.type === 'video' ? (
                                        <div className="relative w-full h-full">
                                            <video src={item.url} muted />
                                            <div className="media-carousel-play-overlay">
                                                <Play size={20} fill="white" color="white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={item.url} alt={item.caption} />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MediaCarousel;
