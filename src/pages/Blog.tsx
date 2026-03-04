import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, BookOpen } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    description: string;
    content: string;
    photo_url: string;
    created_at: string;
}

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        if (selectedPost) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedPost]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setPosts(data);
            }
            setLoading(false);
        };

        fetchBlogs();
    }, []);

    return (
        <div className="page-container">
            <header className="page-head">
                <div className="page-tag">
                    <div className="page-tag-dot">
                        <BookOpen size={11} color="#fff" fill="#fff" />
                    </div>
                    Health Insights
                </div>
                <h1 className="page-title">
                    Medical <strong>Blog</strong>
                </h1>
                <p className="page-subtitle">Expert advice and in-depth articles on mental health and wellness.</p>
            </header>

            <div className="blog-grid">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="blog-card animate-pulse">
                            <div className="blog-card__img bg-zinc-800" />
                            <div className="blog-card__content">
                                <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                                <div className="h-4 bg-zinc-800 rounded w-full" />
                            </div>
                        </div>
                    ))
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="blog-card"
                            onClick={() => setSelectedPost(post)}
                        >
                            <img src={post.photo_url} alt={post.title} className="blog-card__img" />
                            <div className="blog-card__content">
                                <h3 className="blog-card__title">{post.title}</h3>
                                <p className="blog-card__desc">{post.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-gray-500">No blog posts found at this time.</p>
                    </div>
                )}
            </div>

            {selectedPost && (
                <div className="blog-modal" onClick={() => setSelectedPost(null)}>
                    <div className="blog-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="blog-modal__close" onClick={() => setSelectedPost(null)}>
                            <X size={20} />
                        </button>
                        <img src={selectedPost.photo_url} alt={selectedPost.title} className="blog-modal__img" />
                        <div className="blog-modal__inner">
                            <h2 className="blog-modal__title">{selectedPost.title}</h2>
                            <p className="blog-modal__caption">{selectedPost.description}</p>
                            <div className="blog-modal__body">
                                {selectedPost.content.split('\n').map((para, i) => (
                                    para && <p key={i} className="mb-6">{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
