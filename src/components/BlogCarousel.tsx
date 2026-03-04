import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowRight, BookOpen } from 'lucide-react';

interface BlogItem {
    id: string;
    title: string;
    description: string;
    photo_url: string;
    created_at: string;
}

const BlogCarousel = () => {
    const [items, setItems] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('id, title, description, photo_url, created_at')
                .order('created_at', { ascending: false })
                .limit(4);

            if (!error && data) {
                setItems(data);
            }
            setLoading(false);
        };

        fetchBlogs();
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
                            <BookOpen size={11} color="#fff" fill="#fff" />
                        </div>
                        Blog Articles
                    </div>
                    <Link to="/blog" className="media-carousel-more">
                        <span>View Blog</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="media-carousel-track-wrapper">
                    <div className="media-carousel-track">
                        {displayItems.map((item, index) => {
                            return (
                                <Link to="/blog" key={`${item.id}-${index}`} className="feed-carousel-card">
                                    <div className="feed-carousel-media">
                                        {item.photo_url ? (
                                            <img src={item.photo_url} alt={item.title} />
                                        ) : (
                                            <div className="feed-carousel-placeholder" />
                                        )}
                                    </div>
                                    <div className="feed-carousel-info">
                                        <h3 className="feed-carousel-title">{item.title}</h3>
                                        {item.description && (
                                            <p className="feed-carousel-desc">{item.description}</p>
                                        )}
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

export default BlogCarousel;
