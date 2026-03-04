import {
    Users, BedDouble, FlaskConical, Pill, Car, Coffee,
    Clock, CheckCircle, MapPin, Building2,
} from 'lucide-react';

const facilities = [
    { icon: <Users size={22} />, label: 'Trained & Friendly Staff' },
    { icon: <BedDouble size={22} />, label: '40 Rooms – All Bath Attached' },
    { icon: <CheckCircle size={22} />, label: 'Inpatient & Outpatient Services' },
    { icon: <Clock size={22} />, label: 'Dedicated Waiting Area' },
    { icon: <FlaskConical size={22} />, label: 'Laboratory Services' },
    { icon: <Pill size={22} />, label: 'In-house Pharmacy' },
    { icon: <Car size={22} />, label: 'Sufficient Parking Space' },
    { icon: <Coffee size={22} />, label: 'Coffee Shop On-site' },
];

export default function FacilitiesSection() {
    return (
        <section className="section section--grey facilities" id="facilities">
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div className="section__head" style={{ textAlign: 'center' }}>
                    <div className="hero__tag">
                        <div className="hero__tag-dot">
                            <Building2 size={11} color="#fff" fill="#fff" />
                        </div>
                        Our Facilities
                    </div>
                    <h2 className="section__title">Built for Healing</h2>
                    <p className="section__subtitle" style={{ margin: '0 auto' }}>
                        Our hospital is designed to provide a calm, supportive environment
                        equipped with everything needed for comprehensive inpatient and outpatient care.
                    </p>
                </div>

                <div className="facilities__grid">
                    {facilities.map((f, i) => (
                        <div className="facility-card" key={i}>
                            <div className="facility-card__icon">{f.icon}</div>
                            <div className="facility-card__label">{f.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
