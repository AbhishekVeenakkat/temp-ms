import { Phone, ArrowRight, Heart, Shield, Brain, Users } from 'lucide-react';

interface HeroProps {
    onNavigate: (section: string) => void;
}

const cards = [
    {
        icon: <Brain size={22} />,
        title: 'Evidence-Based Psychiatry',
        text: 'Comprehensive assessment and structured treatment following MHCA 2017 guidelines.',
    },
    {
        icon: <Heart size={22} />,
        title: 'Compassionate Care',
        text: 'A calm, healing environment where every patient is treated with dignity and respect.',
    },
    {
        icon: <Shield size={22} />,
        title: 'Confidential & Safe',
        text: 'Patient privacy and trust are at the heart of every interaction at our hospital.',
    },
];

export default function Hero({ onNavigate }: HeroProps) {
    return (
        <section className="hero" id="welcome">
            <div className="hero__inner">
                {/* Left: Text Content */}
                <div>
                    <div className="hero__tag">
                        <div className="hero__tag-dot">
                            <Heart size={11} color="#fff" fill="#fff" />
                        </div>
                        Mental Healthcare in Kerala
                    </div>

                    <h1 className="hero__title">
                        <span className="reveal-text reveal-text--delay" style={{ animationDelay: '0.1s' }}>Healing Minds,</span><br />
                        <strong className="reveal-text reveal-text--delay" style={{ animationDelay: '0.2s' }}>Restoring Lives</strong>
                    </h1>

                    <p className="hero__subtitle">
                        <span className="reveal-text">Manassanthi Hospitals</span> delivers safe, ethical, and evidence-based psychiatric care
                        in a calm healing environment — supporting each person's recovery with
                        compassion, respect, and confidentiality.
                    </p>

                    <div className="hero__actions">
                        <button className="btn-primary" onClick={() => onNavigate('doctors')}>
                            Meet Our Doctors <ArrowRight size={16} />
                        </button>
                        <button className="btn-secondary" onClick={() => onNavigate('contact')}>
                            <Phone size={15} /> Call Us
                        </button>
                    </div>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <div className="hero__stat-value">20+</div>
                            <div className="hero__stat-label">Years of Experience</div>
                        </div>
                        <div className="hero__stat">
                            <div className="hero__stat-value">40</div>
                            <div className="hero__stat-label">Inpatient Rooms</div>
                        </div>
                        <div className="hero__stat">
                            <div className="hero__stat-value">MHCA</div>
                            <div className="hero__stat-label">2017 Compliant</div>
                        </div>
                        <div className="hero__stat">
                            <div className="hero__stat-value">3</div>
                            <div className="hero__stat-label">Expert Psychiatrists</div>
                        </div>
                    </div>
                </div>

                {/* Right: Cards */}
                <div className="hero__visual">
                    {cards.map((c, i) => (
                        <div className="hero__card" key={i}>
                            <div className="hero__card-icon-wrap">{c.icon}</div>
                            <div>
                                <h3>{c.title}</h3>
                                <p>{c.text}</p>
                            </div>
                        </div>
                    ))}

                    {/* Family Partnership badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'rgba(123,30,242,0.1)',
                        border: '1px solid rgba(123,30,242,0.2)',
                        borderRadius: '14px', padding: '14px 20px',
                    }}>
                        <Users size={20} color="var(--color-accent-2)" />
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>Family Partnership</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Guidance and support for caregivers</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
