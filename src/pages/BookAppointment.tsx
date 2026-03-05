import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, User, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Toast from '../components/Toast';

interface Doctor {
    id: string;
    name: string;
    qualification: string;
    caption: string;
    photo_url: string;
    available_days: string[];
    time_start: string;
    time_end: string;
}

const gradients = [
    'linear-gradient(135deg, #68dce3 0%, #133882 100%)',
    'linear-gradient(135deg, #7b1ef2 0%, #4c82ec 100%)',
    'linear-gradient(135deg, #3a9bd5 0%, #133882 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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

const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const nextHour = currentMin === 0 ? currentHour + 1 : currentHour + 1;
        const nextMin = 0;
        
        const start = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        const end = `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`;
        
        slots.push(`${formatTime(start)} - ${formatTime(end)}`);
        
        currentHour = nextHour;
        currentMin = nextMin;
    }
    
    return slots;
};

function BookAppointment() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Validate date against doctor's available days
    useEffect(() => {
        if (selectedDate && selectedDoctor) {
            const date = new Date(selectedDate + 'T00:00:00');
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const selectedDay = dayNames[date.getDay()];
            
            if (!selectedDoctor.available_days?.includes(selectedDay)) {
                setDateError(`Doctor is not available on ${selectedDay}s. Available days: ${selectedDoctor.available_days?.join(', ')}`);
                setSelectedTimeSlot(''); // Clear time slot when date is invalid
            } else {
                setDateError('');
            }
        } else {
            setDateError('');
        }
    }, [selectedDate, selectedDoctor]);

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

    const availableTimeSlots = selectedDoctor 
        ? generateTimeSlots(selectedDoctor.time_start, selectedDoctor.time_end)
        : [];

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedDoctor) {
            setToast({ message: 'Please select a doctor', type: 'error' });
            return;
        }

        if (!validatePhone(patientPhone)) {
            setToast({ message: 'Please enter a valid phone number', type: 'error' });
            return;
        }

        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('appointments')
                .insert({
                    doctor_id: selectedDoctor.id,
                    doctor_name: selectedDoctor.name,
                    appointment_date: selectedDate,
                    time_slot: selectedTimeSlot,
                    patient_name: patientName,
                    patient_phone: patientPhone,
                    status: 'pending'
                });

            if (error) throw error;

            setToast({ message: 'Appointment request submitted successfully!', type: 'success' });
            
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error: any) {
            setToast({ message: error.message || 'Failed to book appointment', type: 'error' });
            setSubmitting(false);
        }
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="page-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            
            <header className="page-head">
                <div className="page-tag">
                    <div className="page-tag-dot">
                        <CalendarIcon size={11} color="#fff" fill="#fff" />
                    </div>
                    Book Appointment
                </div>
                <h1 className="page-title">
                    Schedule your <strong>consultation</strong>
                </h1>
                <p className="page-subtitle">
                    Select a doctor, choose your preferred date and time slot. 
                    Our hospital reception will call you back to confirm your appointment.
                </p>
            </header>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="ask-doctor-form-card">
                    <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', marginBottom: '32px', border: '1px solid #bfdbfe' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <CheckCircle size={20} color="#133882" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#133882', marginBottom: '4px' }}>
                                    This is an appointment request
                                </p>
                                <p style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.5 }}>
                                    Once submitted, our hospital reception will contact you via phone to confirm your appointment and provide any additional details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Doctor Selection */}
                        <div className="form-group" style={{ marginBottom: 32 }}>
                            <label className="form-label" style={{ marginBottom: 16 }}>
                                Select Doctor <span style={{ color: '#e74c3c' }}>*</span>
                            </label>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                                    {doctors.map((doctor, i) => (
                                        <div
                                            key={doctor.id}
                                            onClick={() => setSelectedDoctor(doctor)}
                                            style={{
                                                padding: 16,
                                                borderRadius: 12,
                                                border: '2px solid',
                                                borderColor: selectedDoctor?.id === doctor.id ? '#133882' : '#e2e8f0',
                                                background: selectedDoctor?.id === doctor.id ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                                {doctor.photo_url ? (
                                                    <img
                                                        src={doctor.photo_url}
                                                        alt={doctor.name}
                                                        style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div 
                                                        style={{ 
                                                            width: 56,
                                                            height: 56,
                                                            borderRadius: 8,
                                                            background: gradients[i % gradients.length],
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 18,
                                                            fontWeight: 700,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {getInitials(doctor.name)}
                                                    </div>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#133882', marginBottom: 2 }}>
                                                        {doctor.name}
                                                    </div>
                                                    {doctor.qualification && (
                                                        <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>
                                                            {doctor.qualification}
                                                        </div>
                                                    )}
                                                    {doctor.caption && (
                                                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                                            {doctor.caption}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Show doctor availability */}
                        {selectedDoctor && (
                            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 24, border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                                    <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
                                    Doctor's Availability
                                </p>
                                <p style={{ fontSize: 14, color: '#133882', fontWeight: 600 }}>
                                    {selectedDoctor.available_days?.join(', ')}
                                </p>
                                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                                    {formatTime(selectedDoctor.time_start)} - {formatTime(selectedDoctor.time_end)}
                                </p>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="form-group">
                            <label htmlFor="date" className="form-label">
                                Preferred Date <span style={{ color: '#e74c3c' }}>*</span>
                            </label>
                            <div className="form-input-wrapper">
                                <CalendarIcon size={18} className="form-input-icon" />
                                <input
                                    id="date"
                                    type="date"
                                    className="form-input"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    onClick={(e) => {
                                        const input = e.currentTarget;
                                        if (input && 'showPicker' in input) {
                                            (input as any).showPicker();
                                        }
                                    }}
                                    min={minDate}
                                    required
                                    disabled={!selectedDoctor}
                                    style={{ borderColor: dateError ? '#e74c3c' : undefined }}
                                />
                            </div>
                            {dateError && (
                                <div style={{ 
                                    marginTop: 8, 
                                    padding: '10px 14px', 
                                    background: '#fef2f2', 
                                    border: '1px solid #fecaca', 
                                    borderRadius: 10, 
                                    fontSize: 13, 
                                    color: '#dc2626',
                                    lineHeight: 1.5
                                }}>
                                    <strong>⚠️ Date not available:</strong> {dateError}
                                </div>
                            )}
                        </div>

                        {/* Time Slot Selection */}
                        <div className="form-group">
                            <label htmlFor="timeSlot" className="form-label">
                                Preferred Time Slot <span style={{ color: '#e74c3c' }}>*</span>
                            </label>
                            <div className="form-input-wrapper">
                                <Clock size={18} className="form-input-icon" />
                                <select
                                    id="timeSlot"
                                    className="form-input"
                                    value={selectedTimeSlot}
                                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                    required
                                    disabled={!selectedDoctor || !!dateError}
                                    style={{ paddingLeft: 44 }}
                                >
                                    <option value="">Select a time slot</option>
                                    {availableTimeSlots.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Patient Details */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Your Name <span style={{ color: '#e74c3c' }}>*</span>
                                </label>
                                <div className="form-input-wrapper">
                                    <User size={18} className="form-input-icon" />
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-input"
                                        placeholder="Full name"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Phone Number <span style={{ color: '#e74c3c' }}>*</span>
                                </label>
                                <div className="form-input-wrapper">
                                    <Phone size={18} className="form-input-icon" />
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="form-input"
                                        placeholder="+91 98765 43210"
                                        value={patientPhone}
                                        onChange={(e) => setPatientPhone(e.target.value)}
                                        pattern="[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}"
                                        title="Please enter a valid phone number (e.g., +91 9876543210 or 9876543210)"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="form-submit-btn"
                            disabled={
                                submitting || 
                                !selectedDoctor || 
                                !selectedDate || 
                                !selectedTimeSlot || 
                                !patientName.trim() || 
                                !patientPhone.trim() ||
                                !!dateError
                            }
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Request Appointment</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BookAppointment;
