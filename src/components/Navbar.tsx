import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CalendarDays, ChevronDown, Instagram, Facebook, Twitter } from 'lucide-react';

interface NavbarProps {
    onNavigate: (section: string) => void;
}

const mainLinks = [
    { label: 'About', id: 'about' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Services', id: 'services' },
];

const moreLinks = [
    { label: 'Facilities', id: 'facilities', isSection: true },
    { label: 'Media', path: '/media', isSection: false },
    { label: 'Feed', path: '/feed', isSection: false },
    { label: 'Blog', path: '/blog', isSection: false },
];

const socialLinks = [
    { label: 'Instagram', icon: Instagram, url: '#' },
    { label: 'Facebook', icon: Facebook, url: '#' },
    { label: 'X (Twitter)', icon: Twitter, url: '#' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [socialOpen, setSocialOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
    const location = useLocation();
    const moreRef = useRef<HTMLLIElement>(null);
    const socialRef = useRef<HTMLLIElement>(null);

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setMoreOpen(false);
            }
            if (socialRef.current && !socialRef.current.contains(event.target as Node)) {
                setSocialOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ... scroll and observer logic remain unchanged ...
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.9) {
                setIsScrolledPastHero(true);
            } else {
                setIsScrolledPastHero(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isHome) {
            setActiveSection('');
            return;
        }

        const sectionIds = ['home', 'welcome', 'history', 'about', 'doctors', 'services', 'facilities', 'contact'];
        const observers: IntersectionObserver[] = [];
        const visibleRatios: Record<string, number> = {};

        const pickActive = () => {
            let best = 'home';
            let bestRatio = -1;
            for (const id of sectionIds) {
                const r = visibleRatios[id] ?? 0;
                if (r > bestRatio) { bestRatio = r; best = id; }
            }
            if (best === 'welcome') setActiveSection('home');
            else if (best === 'history') setActiveSection('about');
            else setActiveSection(best);
        };

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    visibleRatios[id] = entry.intersectionRatio;
                    pickActive();
                },
                { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, [isHome]);

    const handleNav = (id: string) => {
        onNavigate(id);
        setMenuOpen(false);
        setMoreOpen(false);
        setSocialOpen(false);
    };

    const isGlass = isHome && !isScrolledPastHero;

    return (
        <nav className={`navbar ${isGlass ? 'navbar--glass' : ''}`}>
            <div className="navbar__inner">
                <Link to="/" className="navbar__logo" onClick={() => { 
                    setMenuOpen(false); 
                    setMoreOpen(false); 
                    setSocialOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                    <img src="/manassanthi_logo.svg" alt="Manassanthi Hospitals" className="navbar__logo-image" />
                </Link>

                <ul className="navbar__links">
                    {isHome ? (
                        <>
                            {mainLinks.map(l => (
                                <li key={l.id}>
                                    <button
                                        className={`navbar__link${activeSection === l.id ? ' navbar__link--active' : ''}`}
                                        onClick={() => handleNav(l.id)}
                                    >
                                        {l.label}
                                    </button>
                                </li>
                            ))}
                            <li className="navbar__more-container" ref={socialRef}>
                                <button
                                    className={`navbar__link navbar__more-toggle ${socialOpen ? 'navbar__more-toggle--active' : ''}`}
                                    onClick={() => { setSocialOpen(!socialOpen); setMoreOpen(false); }}
                                >
                                    Social <ChevronDown size={14} className={`navbar__more-chevron ${socialOpen ? 'rotated' : ''}`} />
                                </button>
                                {socialOpen && (
                                    <div className="navbar__more-dropdown">
                                        {socialLinks.map(s => (
                                            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="navbar__dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <s.icon size={16} />
                                                {s.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                            <li className="navbar__more-container" ref={moreRef}>
                                <button
                                    className={`navbar__link navbar__more-toggle ${moreOpen ? 'navbar__more-toggle--active' : ''}`}
                                    onClick={() => { setMoreOpen(!moreOpen); setSocialOpen(false); }}
                                >
                                    More <ChevronDown size={14} className={`navbar__more-chevron ${moreOpen ? 'rotated' : ''}`} />
                                </button>

                                {moreOpen && (
                                    <div className="navbar__more-dropdown">
                                        {moreLinks.map(l => (
                                            l.isSection ? (
                                                <button
                                                    key={l.id}
                                                    className={`navbar__dropdown-link${activeSection === l.id ? ' navbar__dropdown-link--active' : ''}`}
                                                    onClick={() => handleNav(l.id!)}
                                                >
                                                    {l.label}
                                                </button>
                                            ) : (
                                                <Link
                                                    key={l.path}
                                                    to={l.path!}
                                                    className={`navbar__dropdown-link${location.pathname === l.path ? ' navbar__dropdown-link--active' : ''}`}
                                                    onClick={() => { setMenuOpen(false); setMoreOpen(false); }}
                                                >
                                                    {l.label}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/" className="navbar__link">Home</Link>
                            </li>
                            <li className="navbar__more-container" ref={socialRef}>
                                <button
                                    className={`navbar__link navbar__more-toggle ${socialOpen ? 'navbar__more-toggle--active' : ''}`}
                                    onClick={() => { setSocialOpen(!socialOpen); setMoreOpen(false); }}
                                >
                                    Social <ChevronDown size={14} className={`navbar__more-chevron ${socialOpen ? 'rotated' : ''}`} />
                                </button>
                                {socialOpen && (
                                    <div className="navbar__more-dropdown">
                                        {socialLinks.map(s => (
                                            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="navbar__dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <s.icon size={16} />
                                                {s.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                            {moreLinks.filter(l => !l.isSection).map(l => (
                                <li key={l.path}>
                                    <Link
                                        to={l.path!}
                                        className={`navbar__link${location.pathname === l.path ? ' navbar__link--active' : ''}`}
                                        onClick={() => { setMenuOpen(false); setMoreOpen(false); }}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </>
                    )}
                </ul>

                <Link
                    to="/book-appointment"
                    className={`navbar__cta ${isGlass ? 'navbar__cta--glass' : ''}`}
                    style={{ display: menuOpen ? 'none' : undefined }}
                    onClick={() => { setMenuOpen(false); setMoreOpen(false); setSocialOpen(false); }}
                >
                    <CalendarDays size={15} /> Book Appointment
                </Link>

                <button
                    className="navbar__hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="navbar__mobile-menu">
                    {isHome ? (
                        <button className="navbar__link" onClick={() => handleNav('home')}>Home</button>
                    ) : (
                        <Link to="/" className="navbar__link" onClick={() => setMenuOpen(false)}>Home</Link>
                    )}

                    {mainLinks.map(l => (
                        <button
                            key={l.id}
                            className={`navbar__link${activeSection === l.id ? ' navbar__link--active' : ''}`}
                            onClick={() => handleNav(l.id)}
                        >
                            {l.label}
                        </button>
                    ))}

                    <div style={{ display: 'flex', gap: '20px', margin: '12px 0' }}>
                        {socialLinks.map(s => (
                            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-muted)' }}>
                                <s.icon size={20} />
                            </a>
                        ))}
                    </div>

                    {moreLinks.map(l => (
                        l.isSection ? (
                            <button
                                key={l.id}
                                className={`navbar__link${activeSection === l.id ? ' navbar__link--active' : ''}`}
                                onClick={() => handleNav(l.id!)}
                            >
                                {l.label}
                            </button>
                        ) : (
                            <Link
                                key={l.path}
                                to={l.path!}
                                className={`navbar__link${location.pathname === l.path ? ' navbar__link--active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {l.label}
                            </Link>
                        )
                    ))}

                    <Link 
                        to="/book-appointment" 
                        className="navbar__cta" 
                        style={{ marginTop: '16px' }}
                        onClick={() => setMenuOpen(false)}
                    >
                        <CalendarDays size={15} /> Book Appointment
                    </Link>
                </div>
            )}
        </nav>
    );
}
