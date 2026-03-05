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
    const [userRole, setUserRole] = useState<string>('admin');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin');
            } else {
                setUser(session.user);
                
                let determinedRole = 'admin';
                
                // Get user role - first try RPC function, then metadata, default to admin
                try {
                    const { data: roleData, error } = await supabase.rpc('get_user_role');
                    if (!error && roleData) {
                        determinedRole = roleData;
                    } else {
                        // Fallback to user metadata
                        determinedRole = session.user.user_metadata?.role || 'admin';
                    }
                } catch (err) {
                    // If RPC function doesn't exist, use metadata or default to admin
                    determinedRole = session.user.user_metadata?.role || 'admin';
                }
                
                setUserRole(determinedRole);
                
                // Set default active tab based on determined role
                if (determinedRole === 'appointments_only') {
                    setActiveTab('appointments');
                } else {
                    setActiveTab('gallery');
                }
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

    const allTabs = [
        { id: 'gallery', label: 'Gallery', icon: ImageIcon, roles: ['admin'] },
        { id: 'feed', label: 'Feed', icon: MessageSquare, roles: ['admin'] },
        { id: 'blogs', label: 'Blogs', icon: BookOpen, roles: ['admin'] },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope, roles: ['admin'] },
        { id: 'appointments', label: 'Appointments', icon: CalendarCheck, roles: ['admin', 'appointments_only'] },
        { id: 'ask-doctor', label: 'Ask Doctor', icon: MessageCircleHeart, roles: ['admin'] },
    ];

    // Filter tabs based on user role
    const tabs = allTabs.filter(tab => tab.roles.includes(userRole));
    
    // Get active tab label
    const activeTabLabel = allTabs.find(tab => tab.id === activeTab)?.label || '';

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

                <div className="text-xs text-slate-400 font-medium mb-2 px-4">
                    Logged in as:<br />
                    <span className="text-slate-600 font-bold">{user?.email}</span>
                </div>

                {userRole !== 'admin' && (
                    <div className="mb-4 px-4">
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: 6,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {userRole === 'appointments_only' ? 'Appointments Only' : userRole}
                        </span>
                    </div>
                )}

                <button onClick={handleLogout} className="admin-logout">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                {activeTab ? (
                    <>
                        <header className="admin-header">
                            <h1 className="admin-header__title">{activeTabLabel} Management</h1>
                        </header>

                        <div className="min-h-[500px]">
                            {activeTab === 'gallery' && <AdminMedia />}
                            {activeTab === 'feed' && <AdminFeed />}
                            {activeTab === 'blogs' && <AdminBlog />}
                            {activeTab === 'doctors' && <AdminDoctors />}
                            {activeTab === 'appointments' && <AdminAppointments />}
                            {activeTab === 'ask-doctor' && <AdminAskDoctor />}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-[500px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
