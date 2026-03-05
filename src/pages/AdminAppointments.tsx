import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Calendar as CalendarIcon, X, User, Phone, Clock, FileText, Eye, CheckCircle, Filter } from 'lucide-react';

interface Appointment {
    id: string;
    created_at: string;
    doctor_id: string;
    doctor_name: string;
    appointment_date: string;
    time_slot: string;
    patient_name: string;
    patient_phone: string;
    status: string;
    admin_notes: string | null;
}

interface Doctor {
    id: string;
    name: string;
}

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    
    // Filter states
    const [filterDoctor, setFilterDoctor] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');

    useEffect(() => { 
        fetchAppointments();
        fetchDoctors();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [appointments, filterDoctor, filterStatus, filterDateFrom, filterDateTo]);

    const fetchDoctors = async () => {
        const { data, error } = await supabase
            .from('doctors')
            .select('id, name')
            .order('name');
        if (!error && data) setDoctors(data);
    };

    const applyFilters = () => {
        let filtered = [...appointments];

        // Filter by doctor
        if (filterDoctor !== 'all') {
            filtered = filtered.filter(apt => apt.doctor_id === filterDoctor);
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(apt => apt.status === filterStatus);
        }

        // Filter by date range
        if (filterDateFrom) {
            filtered = filtered.filter(apt => apt.appointment_date >= filterDateFrom);
        }
        if (filterDateTo) {
            filtered = filtered.filter(apt => apt.appointment_date <= filterDateTo);
        }

        setFilteredAppointments(filtered);
    };

    const clearFilters = () => {
        setFilterDoctor('all');
        setFilterStatus('all');
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    const fetchAppointments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('appointment_date', { ascending: false })
            .order('created_at', { ascending: false });
        if (!error && data) setAppointments(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this appointment request?')) return;
        setDeleting(true);
        const { error } = await supabase.from('appointments').delete().eq('id', id);
        if (!error) {
            fetchAppointments();
            if (selectedAppointment?.id === id) setSelectedAppointment(null);
        }
        setDeleting(false);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            // Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Current session:', session ? 'Authenticated' : 'Not authenticated');
            
            if (!session) {
                alert('You must be logged in to update appointments');
                setUpdating(false);
                return;
            }

            console.log('Attempting to update appointment via RPC:', { id, newStatus });
            
            // Use RPC function to bypass CORS PATCH issues
            const { data, error } = await supabase.rpc('update_appointment_status', {
                appointment_id: id,
                new_status: newStatus
            });
            
            if (error) {
                console.error('Supabase RPC error:', error);
                alert(`Failed to update status: ${error.message}`);
            } else {
                console.log('Status updated successfully via RPC:', data);
                await fetchAppointments();
                if (selectedAppointment?.id === id) {
                    setSelectedAppointment({ ...selectedAppointment, status: newStatus });
                }
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
            alert(`An unexpected error occurred: ${err.message || err}`);
        }
        setUpdating(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Appointment Requests</p>
                    <p style={{ fontSize: 15, color: '#64748b', fontWeight: 600 }}>
                        {filteredAppointments.length} of {appointments.length} {appointments.length === 1 ? 'request' : 'requests'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Filter size={18} color="#133882" />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#133882', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Filter Appointments
                    </h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            Doctor
                        </label>
                        <select
                            value={filterDoctor}
                            onChange={(e) => setFilterDoctor(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#334155',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <option value="all">All Doctors</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#334155',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            From Date
                        </label>
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#334155',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            To Date
                        </label>
                        <input
                            type="date"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#334155',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                </div>

                {(filterDoctor !== 'all' || filterStatus !== 'all' || filterDateFrom || filterDateTo) && (
                    <button
                        onClick={clearFilters}
                        className="admin-btn admin-btn--ghost"
                        style={{ marginTop: 16, fontSize: 13 }}
                    >
                        <X size={14} />
                        <span>Clear Filters</span>
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ height: 90, background: '#f1f5f9', borderRadius: 16 }} />
                        ))}
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="admin-card" style={{ padding: 60, textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CalendarIcon size={32} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                            {appointments.length === 0 ? 'No Appointments Yet' : 'No Matching Appointments'}
                        </h3>
                        <p style={{ fontSize: 14, color: '#94a3b8' }}>
                            {appointments.length === 0 ? 'Appointment requests will appear here.' : 'Try adjusting your filters.'}
                        </p>
                    </div>
                ) : (
                    filteredAppointments.map(appointment => {
                        return (
                            <div 
                                key={appointment.id} 
                                className="admin-card" 
                                style={{ 
                                    display: 'flex',
                                    padding: 20,
                                    gap: 16,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => setSelectedAppointment(appointment)}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <CalendarIcon size={12} />
                                            Requested on {formatDateTime(appointment.created_at)}
                                        </span>
                                        <span style={{ 
                                            padding: '2px 10px', 
                                            background: appointment.status === 'pending' ? '#fef3c7' : appointment.status === 'confirmed' ? '#dcfce7' : '#f3f4f6',
                                            color: appointment.status === 'pending' ? '#92400e' : appointment.status === 'confirmed' ? '#166534' : '#6b7280',
                                            fontSize: 11, 
                                            fontWeight: 700, 
                                            borderRadius: 6 
                                        }}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <User size={14} color="#64748b" />
                                            <div>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: '#133882' }}>
                                                    {appointment.patient_name}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Phone size={14} color="#64748b" />
                                            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                                                {appointment.patient_phone}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                        <div style={{ fontSize: 13, color: '#475569' }}>
                                            <span style={{ fontWeight: 600, color: '#133882' }}>Doctor:</span> {appointment.doctor_name}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#475569' }}>
                                            <span style={{ fontWeight: 600, color: '#133882' }}>Date:</span> {formatDate(appointment.appointment_date)}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#475569' }}>
                                            <span style={{ fontWeight: 600, color: '#133882' }}>Time:</span> {appointment.time_slot}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    {appointment.status === 'pending' && (
                                        <button 
                                            className="admin-btn admin-btn--primary admin-btn--icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(appointment.id, 'confirmed');
                                            }}
                                            disabled={updating}
                                            title="Mark as Confirmed"
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                    <button 
                                        className="admin-btn admin-btn--ghost admin-btn--icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedAppointment(appointment);
                                        }}
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        className="admin-btn admin-btn--danger admin-btn--icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(appointment.id);
                                        }}
                                        disabled={deleting}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail Modal */}
            {selectedAppointment && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-backdrop" onClick={() => setSelectedAppointment(null)} />
                    <div className="admin-modal-box" style={{ maxWidth: 600 }}>
                        <div className="admin-modal-body">
                            <div className="admin-modal-header">
                                <div className="admin-modal-header__info">
                                    <div className="admin-modal-header__icon">
                                        <CalendarIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="admin-modal-header__title">Appointment Details</p>
                                        <p className="admin-modal-header__subtitle">Review appointment request information</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedAppointment(null)} className="admin-modal-close">
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Patient Information
                                    </p>
                                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <User size={16} color="#64748b" />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: '#133882' }}>
                                                {selectedAppointment.patient_name}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Phone size={16} color="#64748b" />
                                            <span style={{ fontSize: 14, color: '#475569' }}>
                                                {selectedAppointment.patient_phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Appointment Details
                                    </p>
                                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div>
                                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Doctor</span>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: '#133882', marginTop: 2 }}>
                                                {selectedAppointment.doctor_name}
                                            </p>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Preferred Date</span>
                                            <p style={{ fontSize: 14, color: '#475569', marginTop: 2 }}>
                                                {formatDate(selectedAppointment.appointment_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Preferred Time Slot</span>
                                            <p style={{ fontSize: 14, color: '#475569', marginTop: 2 }}>
                                                {selectedAppointment.time_slot}
                                            </p>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Status</span>
                                            <p style={{ marginTop: 4 }}>
                                                <span style={{ 
                                                    padding: '4px 12px', 
                                                    background: selectedAppointment.status === 'pending' ? '#fef3c7' : selectedAppointment.status === 'confirmed' ? '#dcfce7' : '#f3f4f6',
                                                    color: selectedAppointment.status === 'pending' ? '#92400e' : selectedAppointment.status === 'confirmed' ? '#166534' : '#6b7280',
                                                    fontSize: 12, 
                                                    fontWeight: 700, 
                                                    borderRadius: 6,
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {selectedAppointment.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Requested On</span>
                                            <p style={{ fontSize: 14, color: '#475569', marginTop: 2 }}>
                                                {formatDateTime(selectedAppointment.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: 12, background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
                                    <p style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
                                        <strong style={{ color: '#133882' }}>Note:</strong> Contact the patient to confirm the appointment and provide any additional instructions.
                                    </p>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                {selectedAppointment.status === 'pending' && (
                                    <button 
                                        onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')} 
                                        className="admin-btn admin-btn--primary"
                                        disabled={updating}
                                    >
                                        <CheckCircle size={16} />
                                        <span>Mark as Confirmed</span>
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(selectedAppointment.id)} 
                                    className="admin-btn admin-btn--danger"
                                    disabled={deleting}
                                >
                                    <Trash2 size={16} />
                                    <span>Delete Request</span>
                                </button>
                                <button 
                                    onClick={() => setSelectedAppointment(null)} 
                                    className="admin-btn admin-btn--ghost"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointments;
