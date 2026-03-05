import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Media from './pages/Media';
import Feed from './pages/Feed';
import Blog from './pages/Blog';
import AskDoctor from './pages/AskDoctor';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { useEffect } from 'react';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const AppContent = () => {
    const navigate = useNavigate();

    const handleNavigate = (id: string) => {
        if (window.location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
        } else {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div>
            <ScrollToTop />
            {!isAdmin && <Navbar onNavigate={handleNavigate} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/media" element={<Media />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/ask-doctor" element={<AskDoctor />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {!isAdmin && <Footer onNavigate={handleNavigate} />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
