import { MapPin, Phone, Clock, CalendarDays } from 'lucide-react';

export default function InfoCards() {
    const info = [
        {
            icon: <MapPin size={24} />,
            title: 'Location',
            content: 'Kaithakunda, Ramanattukara (Airport Road), Kerala - 673634',
            subContent: 'Easy access from Airport & Railway Station'
        },
        {
            icon: <Phone size={24} />,
            title: 'Contact Us',
            content: '0483 279 4451 / 279 4452',
            subContent: 'Call us today for support!'
        },
        {
            icon: <Clock size={24} />,
            title: 'Opening Hours',
            content: 'Mon - Fri: 6:00AM - 11:00PM',
            subContent: 'Available for consultations'
        },
        {
            icon: <CalendarDays size={24} />,
            title: 'Book Appointment',
            content: 'dr.aneesmanassanthi@gmail.com',
            subContent: 'Email us to schedule a visit'
        }
    ];

    return (
        <section className="info-cards">
            <div className="container">
                <div className="info-cards__grid">
                    {info.map((item, i) => (
                        <div className="info-card" key={i}>
                            <div className="info-card__icon">
                                {item.icon}
                            </div>
                            <div className="info-card__content">
                                <h3 className="info-card__title">{item.title}</h3>
                                <p className="info-card__text">{item.content}</p>
                                <span className="info-card__subtext">{item.subContent}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
