import Navbar from './components/Navbar';
import VideoHero from './components/VideoHero';
import Hero from './components/Hero';
import InfoCards from './components/InfoCards';
import AboutSection from './components/AboutSection';
import HistorySection from './components/HistorySection';
import DoctorsSection from './components/DoctorsSection';
import ServicesSection from './components/ServicesSection';
import FacilitiesSection from './components/FacilitiesSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

function App() {
    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div>
            <Navbar onNavigate={scrollToSection} />
            <VideoHero />
            <Hero onNavigate={scrollToSection} />
            <InfoCards />
            <AboutSection />
            <HistorySection />
            <DoctorsSection />
            <ServicesSection />
            <FacilitiesSection />
            <CtaSection onNavigate={scrollToSection} />
            <Footer onNavigate={scrollToSection} />
        </div>
    );
}

export default App;
