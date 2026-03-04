import { Heart, Eye, ShieldCheck, Microscope, Layers, Users, ArrowRight } from 'lucide-react';

const values = [
    { icon: <Heart size={18} />, title: 'Compassion', text: 'Care that listens without judgment.' },
    { icon: <ShieldCheck size={18} />, title: 'Dignity', text: 'Respect for every individual\'s life and story.' },
    { icon: <Eye size={18} />, title: 'Confidentiality', text: 'Privacy and trust in every interaction.' },
    { icon: <Microscope size={18} />, title: 'Clinical Excellence', text: 'Evidence-based and structured treatment.' },
    { icon: <Layers size={18} />, title: 'Safety & Support', text: 'A healing environment with continuous care.' },
    { icon: <Users size={18} />, title: 'Family Partnership', text: 'Guidance and collaboration with caregivers.' },
];

const founders = [
    {
        initials: 'MH',
        name: 'Prof. (Dr.) Mohammed Hasan',
        role: 'Founder Chairman',
        bio: 'Distinguished academician and pioneer in psychology. Author of 25+ books and a lifelong advocate for persons with mental illness.',
        image: '/founder-images/founder_sample.png'
    },
    {
        initials: 'AA',
        name: 'Dr. Anees Ali',
        role: 'Director, Manassanthi Hospitals',
        bio: 'Senior psychiatrist with over two decades of experience, providing clinical, administrative and academic leadership.',
        image: '/founder-images/founder_sample.png'
    },
];

export default function AboutSection() {
    return (
        <section className="section about" id="about">
            <div className="about__layout">
                {/* Left Column */}
                <div>
                    <div className="hero__tag">
                        <div className="hero__tag-dot">
                            <Heart size={11} color="#fff" fill="#fff" />
                        </div>
                        About Us
                    </div>

                    <h2 className="about__title">
                        Committed to<br />Mental Well-being
                    </h2>

                    <div style={{ marginBottom: '28px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>
                            Our Mission
                        </h3>
                        <p className="about__text" style={{ marginBottom: 0 }}>
                            To deliver safe, ethical, and evidence-based psychiatric care in a calm healing environment,
                            supporting each person's recovery with compassion, respect, and confidentiality.
                        </p>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>
                            Our Vision
                        </h3>
                        <p className="about__text" style={{ marginBottom: 0 }}>
                            To be a trusted centre for mental healthcare in Kerala, known for quality treatment,
                            humane care, and meaningful recovery for patients and families.
                        </p>
                    </div>

                </div>

                {/* Right Column: Founders */}
                <div className="about__founders">
                    <div className="about__founders-title">
                        Our Founders
                    </div>

                    {founders.map((f, i) => (
                        <div className="about__founder" key={i}>
                            <img
                                src={f.image}
                                alt={f.name}
                                className="about__founder-img"
                            />
                            <div>
                                <div className="about__founder-name">{f.name}</div>
                                <div className="about__founder-role" style={{ color: 'var(--color-accent-2)', fontWeight: 500, fontSize: '13px', marginBottom: '8px' }}>
                                    {f.role}
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.6 }}>{f.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Core Values - Now constrained to container */}
            <div className="container" style={{ marginTop: '80px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '32px', textAlign: 'center' }}>
                    Our Core Values
                </h3>
                <div className="about__values full-width-values">
                    {values.map((v, i) => (
                        <div className="about__value-card" key={i}>
                            <div className="about__value-icon">{v.icon}</div>
                            <div className="about__value-title">{v.title}</div>
                            <div className="about__value-text">{v.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
