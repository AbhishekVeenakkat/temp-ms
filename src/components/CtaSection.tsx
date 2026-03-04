import { Phone, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
    onNavigate: (section: string) => void;
}

export default function CtaSection({ onNavigate }: CtaSectionProps) {
    return (
        <section className="cta-section">
            <div className="cta-section__inner">
                <h2 className="cta-section__title">
                    Begin Your Path to Recovery
                </h2>
                <p className="cta-section__subtitle">
                    Our compassionate team is ready to help. Book an appointment with
                    one of our expert psychiatrists today.
                </p>
                <div className="cta-section__actions">
                    <button className="btn-light" onClick={() => onNavigate('doctors')}>
                        Meet Our Doctors <ArrowRight size={16} />
                    </button>
                    <button className="btn-outline-light">
                        <Phone size={15} /> Call Now
                    </button>
                </div>
            </div>
        </section>
    );
}
