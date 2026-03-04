import { History, MapPin, Award } from 'lucide-react';

export default function HistorySection() {
    return (
        <section className="section history" id="history" style={{ backgroundColor: 'var(--color-white)' }}>
            <div className="container">
                <div className="hero__tag">
                    <div className="hero__tag-dot">
                        <History size={11} color="#fff" fill="#fff" />
                    </div>
                    Our History
                </div>

                <h2 className="about__title" style={{ marginBottom: '40px' }}>
                    A Legacy of Care &<br />Healing Since 2006
                </h2>

                <div className="history__grid">
                    <div className="history__content-left">
                        <p className="about__text history__text-highlight">
                            Established to provide compassionate, ethical, and evidence-based mental health care,
                            Manassanthi is a pioneering psychiatric institution in the Malappuram district
                            and the only hospital of its kind in the Ramanattukara region.
                        </p>

                        <p className="about__text">
                            With a dedicated team of qualified mental health professionals, we offer care for a wide range of psychological and psychiatric conditions, including individual and family counselling, pre- and post-marital guidance, psychotherapy, and structured psychiatric treatment, delivered in a safe and healing environment.
                        </p>

                        <p className="about__text">
                            Guided by empathy and professionalism, we are committed to promoting mental well-being and helping individuals regain stability, confidence, and hope.
                        </p>
                    </div>

                    <div className="history__content-right">
                        <div className="history__card">
                            <div className="history__card-header">
                                <div className="history__card-icon-wrap">
                                    <Award size={22} />
                                </div>
                                <h3 className="history__card-title">Founding & Evolution</h3>
                            </div>
                            <p className="about__text" style={{ fontSize: '14px', marginBottom: '16px' }}>
                                Manassanthi Hospitals was founded in February 2006 at Nallalam, Kozhikode, before relocating to Kaithakunda on the Ramanattukara–Airport Road in July 2008.
                            </p>
                            <p className="about__text" style={{ fontSize: '14px', marginBottom: 0 }}>
                                On an average, about 75 patients receive care daily through outpatient services, and those requiring longer-term management are admitted for inpatient care.
                            </p>
                        </div>

                        <div className="history__card">
                            <div className="history__card-header">
                                <div className="history__card-icon-wrap">
                                    <MapPin size={22} />
                                </div>
                                <h3 className="history__card-title">Therapeutic Environment</h3>
                            </div>
                            <p className="about__text" style={{ fontSize: '14px', marginBottom: '16px' }}>
                                Located on a sprawling, lush countryside campus close to the Ramanattukara Bus Stand, the serene environment makes the hospital more than just a treatment facility—it offers a therapeutic space for recovery and healing.
                            </p>
                            <p className="about__text" style={{ fontSize: '14px', marginBottom: 0 }}>
                                The hospital functions in full compliance with the Mental Healthcare Act (MHCA), 2017, ensuring rights-based, ethical, and patient-centered mental healthcare.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
