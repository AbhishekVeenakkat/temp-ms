import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, BookOpen, MessageCircleHeart, LogOut, Stethoscope, CalendarCheck } from 'lucide-react';
import AdminMedia from './AdminMedia';
import AdminFeed from './AdminFeed';
import AdminBlog from './AdminBlog';
import AdminAskDoctor from './AdminAskDoctor';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';

const AdminDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('gallery');
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin');
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/admin');
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
        </div>
    );

    const tabs = [
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'feed', label: 'Feed', icon: MessageSquare },
        { id: 'blogs', label: 'Blogs', icon: BookOpen },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope },
        { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
        { id: 'ask-doctor', label: 'Ask Doctor', icon: MessageCircleHeart },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-sidebar__logo">
                    MANASSANTHI
                    <span>Admin Portal</span>
                </div>

                <nav className="admin-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`admin-nav__item ${activeTab === tab.id ? 'admin-nav__item--active' : ''}`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="text-xs text-slate-400 font-medium mb-4 px-4">
                    Logged in as:<br />
                    <span className="text-slate-600 font-bold">{user?.email}</span>
                </div>

                <button onClick={handleLogout} className="admin-logout">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <h1 className="admin-header__title capitalize">{activeTab} Management</h1>
                    <p className="admin-header__subtitle">Manage and curate your {activeTab} content.</p>
                </header>

                <div className="min-h-[500px]">
                    {activeTab === 'gallery' && <AdminMedia />}
                    {activeTab === 'feed' && <AdminFeed />}
                    {activeTab === 'blogs' && <AdminBlog />}
                    {activeTab === 'doctors' && <AdminDoctors />}
                    {activeTab === 'appointments' && <AdminAppointments />}
                    {activeTab === 'ask-doctor' && <AdminAskDoctor />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
