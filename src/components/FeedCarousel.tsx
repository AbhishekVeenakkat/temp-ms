import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowRight, Newspaper, Youtube } from 'lucide-react';

interface FeedItem {
    id: string;
    image_url: string;
    description: string;
    youtube_link: string;
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

const FeedCarousel = () => {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            const { data, error } = await supabase
                .from('feed')
                .select('id, image_url, description, youtube_link, created_at')
                .order('created_at', { ascending: false })
                .limit(4);

            if (!error && data) {
                setItems(data);
            }
            setLoading(false);
        };

        fetchFeed();
    }, []);

    if (loading) {
        return (
            <div className="feed-carousel-loading">
                <div className="feed-carousel-skeleton-track">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="feed-carousel-skeleton-card" />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    // Duplicate items to create infinite loop effect
    const displayItems = [...items, ...items, ...items];

    return (
        <section className="feed-carousel-section">
            <div className="media-carousel-container">
                <div className="media-carousel-header">
                    <div className="hero__tag" style={{ margin: 0 }}>
                        <div className="hero__tag-dot" style={{ background: 'var(--color-accent-2)' }}>
                            <Newspaper size={11} color="#fff" fill="#fff" />
                        </div>
                        News & Updates
                    </div>
                    <Link to="/feed" className="media-carousel-more">
                        <span>View Feed</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="media-carousel-track-wrapper">
                    <div className="feed-carousel-track">
                        {displayItems.map((item, index) => {
                            const ytThumb = getYouTubeThumbnail(item.youtube_link);
                            const coverSrc = ytThumb || item.image_url;

                            return (
                                <Link to="/feed" key={`${item.id}-${index}`} className="feed-carousel-card">
                                    <div className="feed-carousel-media">
                                        {coverSrc ? (
                                            <img src={coverSrc} alt="Feed item" />
                                        ) : (
                                            <div className="feed-carousel-placeholder" />
                                        )}
                                        {ytThumb && (
                                            <div className="feed-carousel-play-overlay">
                                                <Youtube size={24} color="#dc2626" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="feed-carousel-info">
                                        <p className="feed-carousel-desc">{item.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeedCarousel;
