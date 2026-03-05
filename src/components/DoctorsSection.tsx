import { Calendar, MapPin, Clock, User, Users } from 'lucide-react';
import AskDoctorCard from './AskDoctorCard';

const doctors = [
    {
        initials: 'AA',
        name: 'Dr. Anees Ali',
        qualifications: 'MBBS, DPM, MD (Psychiatry)',
        role: 'Consultant Neuropsychiatrist & Director, Manassanthi Hospitals',
        schedule: [
            { label: 'OP Days', value: 'Monday – Saturday (except 2nd Wednesdays onwards)' },
            { label: 'Overseas (Sharjah)', value: 'Rayhan Gulf Medical Center, 1st Wed–Sat/month' },
            { label: 'Overseas (Doha)', value: 'Naseem Al-Rabeeh Medical Center, 1st Wed–Sat/month' },
        ],
        bio: 'Past President, IMA Feroke Unit. Former Treasurer, IPS Kerala. Author of 5 books on mental health awareness. Two decades of clinical and academic leadership.',
        gradient: 'linear-gradient(135deg, #68dce3 0%, #133882 100%)',
        image: '/doctor_images/doctor_sample.png'
    },
    {
        initials: 'AS',
        name: 'Dr. Anjana Suresh',
        qualifications: 'MBBS, MD (Psychiatry)',
        role: 'Consultant Psychiatrist',
        schedule: [
            { label: 'OP Timings', value: 'Monday – Saturday: 9:00 AM – 5:00 PM' },
        ],
        bio: 'Specialist in evidence-based psychiatric care with expertise in assessment and management of a wide range of mental health disorders.',
        gradient: 'linear-gradient(135deg, #7b1ef2 0%, #4c82ec 100%)',
        image: '/doctor_images/doctor_sample.png'
    },
    {
        initials: 'SP',
        name: 'Dr. Shibil PP',
        qualifications: 'MBBS, MD (Psychiatry)',
        role: 'Consultant Psychiatrist',
        schedule: [
            { label: 'OP Timings', value: 'Monday – Saturday: 10:00 AM – 6:00 PM' },
        ],
        bio: 'Dedicated to providing compassionate, patient-centred psychiatric care with a focus on clinical excellence and individualized recovery planning.',
        gradient: 'linear-gradient(135deg, #3a9bd5 0%, #133882 100%)',
        image: '/doctor_images/doctor_sample.png'
    },
];

const supportTeam = [
    {
        name: 'Ms. Rajula Anees',
        qual: 'BSC (HSC), MA (Psych)',
        role: 'Clinical Psychologist',
        icon: <User size={20} />,
    },
    {
        name: 'Ms. Athira',
        qual: 'MSW',
        role: 'Psychiatric Social Worker',
        icon: <User size={20} />,
    },
];

export default function DoctorsSection() {
    return (
        <section className="section section--grey doctors" id="doctors">
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div className="section__head" style={{ textAlign: 'center' }}>
                    <div className="hero__tag">
                        <div className="hero__tag-dot">
                            <Users size={11} color="#fff" fill="#fff" />
                        </div>
                        Our Team
                    </div>
                    <h2 className="section__title">Expert Psychiatric Care</h2>
                    <p className="section__subtitle" style={{ margin: '0 auto' }}>
                        Our experienced team of psychiatrists and mental health professionals
                        are here to guide you through your recovery journey.
                    </p>
                </div>

                <div className="doctors__grid">
                    {doctors.map((doc, i) => (
                        <div className="doctor-card" key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img
                                    src={doc.image}
                                    alt={doc.name}
                                    className="doctor-card__img"
                                />
                                <div>
                                    <div className="doctor-card__name">{doc.name}</div>
                                    <div className="doctor-card__qual">{doc.qualifications}</div>
                                    <div className="doctor-card__role">{doc.role}</div>
                                </div>
                            </div>

                            <div className="doctor-card__divider" />

                            <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.65 }}>
                                {doc.bio}
                            </p>

                            <div className="doctor-card__divider" />

                            <div className="doctor-card__info">
                                {doc.schedule.map((s, j) => (
                                    <div className="doctor-card__info-row" key={j}>
                                        {j === 0 ? <Clock size={14} className="doctor-card__info-icon" /> : <MapPin size={14} className="doctor-card__info-icon" />}
                                        <div>
                                            <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '12px', display: 'block', marginBottom: '1px' }}>
                                                {s.label}
                                            </span>
                                            {s.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="doctor-card__cta">
                                <Calendar size={14} /> Book Appointment
                            </button>
                        </div>
                    ))}
                </div>

                {/* Support Team */}
                <div style={{ marginTop: '60px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '6px', textAlign: 'center' }}>
                        Psychology & Psychosocial Support Team
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginBottom: '28px' }}>
                        Supporting your mental health journey through evidence-based psychological interventions.
                    </p>
                    <div className="support-grid">
                        {supportTeam.map((s, i) => (
                            <div className="support-card" key={i}>
                                <div className="support-card__icon">{s.icon}</div>
                                <div>
                                    <div className="support-card__name">{s.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-accent-2)', fontWeight: 600, marginBottom: '2px' }}>{s.qual}</div>
                                    <div className="support-card__role">{s.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <AskDoctorCard />
                </div>
            </div>
        </section>
    );
}
