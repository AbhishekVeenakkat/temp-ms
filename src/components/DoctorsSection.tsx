import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Users } from 'lucide-react';
import AskDoctorCard from './AskDoctorCard';
import { supabase } from '../lib/supabase';

interface Doctor {
    id: string;
    name: string;
    qualification: string;
    caption: string;
    description: string;
    photo_url: string;
    available_days: string[];
    availability_note: string;
    time_start: string;
    time_end: string;
    additional_locations: { label: string; description: string }[];
    rank: number;
}

const gradients = [
    'linear-gradient(135deg, #68dce3 0%, #133882 100%)',
    'linear-gradient(135deg, #7b1ef2 0%, #4c82ec 100%)',
    'linear-gradient(135deg, #3a9bd5 0%, #133882 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
];

const getInitials = (name: string) => {
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
};

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
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .order('rank', { ascending: true });
        
        if (!error && data) {
            setDoctors(data);
        }
        setLoading(false);
    };

    const getDoctorSchedule = (doctor: Doctor) => {
        const schedule = [];
        if (doctor.available_days && doctor.available_days.length > 0) {
            const daysText = doctor.available_days.join(', ');
            const fullText = doctor.availability_note 
                ? `${daysText} (${doctor.availability_note})`
                : daysText;
            schedule.push({
                label: 'Available Days',
                value: fullText
            });
        }
        if (doctor.time_start && doctor.time_end) {
            const timeText = `${formatTime(doctor.time_start)} – ${formatTime(doctor.time_end)}`;
            schedule.push({
                label: 'Timings',
                value: timeText
            });
        }
        // Add additional locations
        if (doctor.additional_locations && doctor.additional_locations.length > 0) {
            doctor.additional_locations.forEach(loc => {
                if (loc.label && loc.description) {
                    schedule.push({
                        label: loc.label,
                        value: loc.description
                    });
                }
            });
        }
        return schedule;
    };

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

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
                    </div>
                ) : doctors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px' }}>
                        <Users size={48} style={{ margin: '0 auto 16px', color: '#cbd5e1' }} />
                        <p style={{ fontSize: '16px', color: '#64748b' }}>No doctors available at the moment.</p>
                    </div>
                ) : (
                    <div className="doctors__grid">
                        {doctors.map((doc, i) => {
                            const schedule = getDoctorSchedule(doc);
                            return (
                                <div className="doctor-card" key={doc.id}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {doc.photo_url ? (
                                            <img
                                                src={doc.photo_url}
                                                alt={doc.name}
                                                className="doctor-card__img"
                                            />
                                        ) : (
                                            <div 
                                                className="doctor-card__img"
                                                style={{ 
                                                    background: gradients[i % gradients.length],
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    color: 'white'
                                                }}
                                            >
                                                {getInitials(doc.name)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="doctor-card__name">{doc.name}</div>
                                            {doc.qualification && <div className="doctor-card__qual">{doc.qualification}</div>}
                                            {doc.caption && <div className="doctor-card__role">{doc.caption}</div>}
                                        </div>
                                    </div>

                                    {doc.description && (
                                        <>
                                            <div className="doctor-card__divider" />
                                            <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.65 }}>
                                                {doc.description}
                                            </p>
                                        </>
                                    )}

                                    {schedule.length > 0 && (
                                        <>
                                            <div className="doctor-card__divider" />
                                            <div className="doctor-card__info">
                                                {schedule.map((s, j) => {
                                                    const isLocation = j >= 2; // First 2 are Available Days and Timings
                                                    return (
                                                        <div className="doctor-card__info-row" key={j}>
                                                            {isLocation ? (
                                                                <MapPin size={14} className="doctor-card__info-icon" />
                                                            ) : (
                                                                <Clock size={14} className="doctor-card__info-icon" />
                                                            )}
                                                            <div>
                                                                <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '12px', display: 'block', marginBottom: '1px' }}>
                                                                    {s.label}
                                                                </span>
                                                                {s.value}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}

                                    <Link to="/book-appointment" className="doctor-card__cta">
                                        <Calendar size={14} /> Book Appointment
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

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
