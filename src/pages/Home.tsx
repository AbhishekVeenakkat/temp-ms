import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoHero from '../components/VideoHero';
import Hero from '../components/Hero';
import InfoCards from '../components/InfoCards';
import MediaCarousel from '../components/MediaCarousel';
import FeedCarousel from '../components/FeedCarousel';
import BlogCarousel from '../components/BlogCarousel';
import AboutSection from '../components/AboutSection';
import HistorySection from '../components/HistorySection';
import DoctorsSection from '../components/DoctorsSection';
import ServicesSection from '../components/ServicesSection';
import FacilitiesSection from '../components/FacilitiesSection';
import CtaSection from '../components/CtaSection';
import AskDoctorFab from '../components/AskDoctorFab';

function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.state && (location.state as any).scrollTo) {
            const id = (location.state as any).scrollTo;
            const el = document.getElementById(id);
            if (el) {
                // Small delay to ensure the section is rendered
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="home-page">
            <VideoHero />
            <Hero onNavigate={scrollToSection} />
            <InfoCards />
            <MediaCarousel />
            <FeedCarousel />
            <AboutSection />
            <HistorySection />
            <BlogCarousel />
            <DoctorsSection />
            <ServicesSection />
            <FacilitiesSection />
            <CtaSection onNavigate={scrollToSection} />
            <AskDoctorFab />
        </div>
    );
}

export default Home;
