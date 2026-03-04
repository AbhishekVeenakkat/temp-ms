import { useState } from 'react';
import {
    Brain, Baby, UserRound, Heart, Pill, MessageCircle, CheckCircle, Stethoscope,
} from 'lucide-react';

const categories = [
    {
        id: 'psychiatric',
        label: 'Psychiatric Disorders',
        icon: <Brain size={22} />,
        items: [
            'Anxiety Disorders', 'Generalized Anxiety Disorder', 'Social Anxiety Disorder',
            'Panic Attacks / Panic Disorder', 'Obsessive–Compulsive Disorder (OCD)',
            'Post-Traumatic Stress Disorder (PTSD)', 'Specific Phobias',
            'Major Depressive Disorder / Clinical Depression', 'Persistent Depressive Disorder (Dysthymia)',
            'Bipolar Disorder / Bipolar Depression', 'Postpartum Depression',
            'Seasonal Affective Disorder', 'Psychotic Depression',
            'Schizophrenia and Other Psychotic Disorders', 'Chronic Stress', 'Mood Swings',
            'Somatoform Disorders', 'Sleep Disorders', 'Behavioral Disorders', 'Personality Disorders',
        ],
    },
    {
        id: 'child',
        label: 'Child & Adolescent',
        icon: <Baby size={22} />,
        items: [
            'Attention-Deficit Hyperactivity Disorder (ADHD)', 'Autism Spectrum Disorder (ASD)',
            'Intellectual and Developmental Disabilities (IDD)', 'Specific Learning Disorders',
            'School Refusal', 'Separation Anxiety Disorder', 'Childhood Psychiatric Disorders',
            'Behavioural Problems', 'Emotional Disorders', 'Toileting and Developmental Issues',
            'Behavioral Addictions',
        ],
    },
    {
        id: 'geriatric',
        label: 'Geriatric Mental Health',
        icon: <UserRound size={22} />,
        items: [
            'Dementia', 'Delirium', 'Late-Onset Depression',
            'Anxiety Disorders in the Elderly',
            'Behavioural and Psychological Symptoms of Dementia',
        ],
    },
    {
        id: 'women',
        label: "Women's Mental Health",
        icon: <Heart size={22} />,
        items: [
            'Premenstrual Mood Disorders',
            'Perinatal and Postpartum Mental Health Disorders',
            'Mood Disorders in Women', 'Anxiety Disorders in Women',
            'Psychosocial Stress-Related Disorders', 'Sexual Health and Dysfunction',
            'Male Sexual Dysfunction', 'Female Sexual Dysfunction',
        ],
    },
    {
        id: 'deaddiction',
        label: 'De-addiction Services',
        icon: <Pill size={22} />,
        items: [
            'Alcohol Use Disorders', 'Substance Use Disorders',
            'Behavioural Addictions', 'Relapse Prevention Programs',
        ],
    },
    {
        id: 'therapy',
        label: 'Therapy & Counselling',
        icon: <MessageCircle size={22} />,
        items: [
            'Cognitive Behaviour Therapy (CBT)', 'Dialectical Behaviour Therapy (DBT)',
            'Exposure and Response Prevention (ERP)',
            'Motivational Interviewing and Enhancement Therapy (MET)',
            'Mindfulness-Based Therapy', 'Relaxation Techniques', 'Stress Management',
            'Marital Counselling', 'Pre-Marital Counselling', 'Post-Marital Counselling',
            'Relationship Counselling', 'Anger Management', 'Emotional Regulation Skills',
            'Relapse Prevention Counselling',
        ],
    },
];

export default function ServicesSection() {
    const [activeTab, setActiveTab] = useState('psychiatric');
    const current = categories.find(c => c.id === activeTab)!;

    return (
        <section className="section services" id="services">
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div className="section__head">
                    <div className="hero__tag">
                        <div className="hero__tag-dot">
                            <Stethoscope size={11} color="#fff" fill="#fff" />
                        </div>
                        Our Services
                    </div>
                    <h2 className="section__title">Comprehensive Mental Healthcare</h2>
                    <p className="section__subtitle">
                        Evidence-based, patient-centred services across the full spectrum
                        of mental health — from psychiatric disorders to therapy and counselling.
                    </p>
                </div>

                <div className="services__tabs">
                    {categories.map(c => (
                        <button
                            key={c.id}
                            className={`services__tab${activeTab === c.id ? ' active' : ''}`}
                            onClick={() => setActiveTab(c.id)}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                <div className="services__content">
                    <div className="services__category">
                        <div className="services__category-header">
                            <div className="services__category-icon">{current.icon}</div>
                            <h3 className="services__category-title">{current.label}</h3>
                        </div>
                        <ul className="services__list">
                            {current.items.map((item, i) => (
                                <li className="services__item" key={i}>
                                    <div className="services__item-dot">
                                        <CheckCircle size={12} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
