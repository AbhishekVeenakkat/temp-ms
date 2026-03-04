import { useState, useEffect } from 'react';
import { Menu, X, CalendarDays } from 'lucide-react';

interface NavbarProps {
    onNavigate: (section: string) => void;
}

const links = [
    { label: 'About', id: 'about' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Services', id: 'services' },
    { label: 'Facilities', id: 'facilities' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

    // Track simply if we've scrolled past the initial hero video height
    useEffect(() => {
        const handleScroll = () => {
            // Check if we've scrolled down more than 90% of the viewport height
            // (turning solid slightly before the video completely leaves)
            if (window.scrollY > window.innerHeight * 0.9) {
                setIsScrolledPastHero(true);
            } else {
                setIsScrolledPastHero(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Use IntersectionObserver to track which section is most in view
    useEffect(() => {
        const sectionIds = ['home', 'welcome', 'history', ...links.map(l => l.id), 'contact'];
        const observers: IntersectionObserver[] = [];

        // Track how much of each section is visible
        const visibleRatios: Record<string, number> = {};

        const pickActive = () => {
            // Pick the section with the highest visibility ratio
            let best = 'home';
            let bestRatio = -1;
            for (const id of sectionIds) {
                const r = visibleRatios[id] ?? 0;
                if (r > bestRatio) { bestRatio = r; best = id; }
            }
            // If the user is on 'welcome' or 'history', highlight 'home' or 'about'
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
                // Fire at many thresholds for smooth updates
                { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, []);

    const handleNav = (id: string) => {
        onNavigate(id);
        setMenuOpen(false);
    };

    const isGlass = !isScrolledPastHero;

    return (
        <nav className={`navbar ${isGlass ? 'navbar--glass' : ''}`}>
            <div className="navbar__inner">
                <div className="navbar__logo" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
                    <span className="navbar__logo-name">Manassanthi</span>
                    <span className="navbar__logo-tagline">Hospitals</span>
                </div>

                <ul className="navbar__links">
                    {links.map(l => (
                        <li key={l.id}>
                            <button
                                className={`navbar__link${activeSection === l.id ? ' navbar__link--active' : ''}`}
                                onClick={() => handleNav(l.id)}
                            >
                                {l.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    className="navbar__cta"
                    onClick={() => handleNav('contact')}
                    style={{ display: menuOpen ? 'none' : undefined }}
                >
                    <CalendarDays size={15} /> Book Appointment
                </button>

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
                    {links.map(l => (
                        <button
                            key={l.id}
                            className={`navbar__link${activeSection === l.id ? ' navbar__link--active' : ''}`}
                            style={{ textAlign: 'left', width: '100%' }}
                            onClick={() => handleNav(l.id)}
                        >
                            {l.label}
                        </button>
                    ))}
                    <button className="navbar__cta" style={{ marginTop: '8px' }}
                        onClick={() => handleNav('contact')}>
                        <CalendarDays size={15} /> Book Appointment
                    </button>
                </div>
            )}
        </nav>
    );
}
