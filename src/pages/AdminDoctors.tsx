import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, User, Image as ImageIcon, X, Clock, Calendar, MapPin } from 'lucide-react';

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
    created_at: string;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [name, setName] = useState('');
    const [qualification, setQualification] = useState('');
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [availabilityNote, setAvailabilityNote] = useState('');
    const [timeStart, setTimeStart] = useState('09:00');
    const [timeEnd, setTimeEnd] = useState('17:00');
    const [additionalLocations, setAdditionalLocations] = useState<{ label: string; description: string }[]>([]);
    const [rank, setRank] = useState<number>(999);

    useEffect(() => { fetchDoctors(); }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('doctors').select('*').order('rank', { ascending: true });
            if (error) {
                console.error('Error fetching doctors:', error);
                throw error;
            }
            if (data) setDoctors(data);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setName('');
        setQualification('');
        setCaption('');
        setDescription('');
        setImageFile(null);
        setAvailableDays([]);
        setAvailabilityNote('');
        setTimeStart('09:00');
        setTimeEnd('17:00');
        setAdditionalLocations([]);
        setRank(999);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setIsModalOpen(false);
    };

    const toggleDay = (day: string) => {
        setAvailableDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Doctor name is required');
            return;
        }
        if (availableDays.length === 0) {
            alert('Please select at least one available day');
            return;
        }

        setSaving(true);
        try {
            let photoUrl = '';
            
            // Handle image upload
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `doctors/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
                photoUrl = publicUrl;
            }

            const payload: any = {
                name,
                qualification: qualification || null,
                caption: caption || null,
                description: description || null,
                available_days: availableDays,
                availability_note: availabilityNote || null,
                time_start: timeStart,
                time_end: timeEnd,
                additional_locations: additionalLocations,
                rank: rank || 999,
            };

            // Only include photo_url if we have one
            if (photoUrl) {
                payload.photo_url = photoUrl;
            }

            const { error } = await supabase.from('doctors').insert(payload);
            if (error) throw error;

            closeModal();
            fetchDoctors();
            alert('Doctor saved successfully!');
        } catch (error: any) {
            console.error('Error saving doctor:', error);
            alert('Error: ' + (error.message || 'Failed to save doctor. Please try again.'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this doctor?')) return;
        const { error } = await supabase.from('doctors').delete().eq('id', id);
        if (!error) {
            fetchDoctors();
            alert('Doctor deleted successfully');
        } else {
            alert('Error deleting doctor');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#133882', marginBottom: 4 }}>Manage Doctors</h2>
                    <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Add and manage doctor profiles</p>
                </div>
                <button onClick={openNew} className="admin-btn admin-btn--primary">
                    <Plus size={18} />
                    <span>Add Doctor</span>
                </button>
            </div>

            {doctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 64, background: '#f8fafc', borderRadius: 16, border: '2px dashed #e2e8f0' }}>
                    <User size={48} style={{ margin: '0 auto 16px', color: '#cbd5e1' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#475569', marginBottom: 8 }}>No doctors yet</h3>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>Get started by adding your first doctor</p>
                    <button onClick={openNew} className="admin-btn admin-btn--primary">
                        <Plus size={18} />
                        <span>Add Doctor</span>
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="admin-card" style={{ padding: 14 }}>
                            <div style={{ position: 'relative', paddingBottom: '100%', borderRadius: 8, overflow: 'hidden', marginBottom: 10, background: '#f1f5f9' }}>
                                {doctor.photo_url ? (
                                    <img src={doctor.photo_url} alt={doctor.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={48} style={{ color: '#cbd5e1' }} />
                                    </div>
                                )}
                            </div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#133882', marginBottom: 4 }}>{doctor.name}</h3>
                            {doctor.qualification && <p style={{ fontSize: 12, color: '#3b82f6', marginBottom: 4, fontWeight: 600 }}>{doctor.qualification}</p>}
                            {doctor.caption && <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontStyle: 'italic' }}>{doctor.caption}</p>}
                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{doctor.description}</p>
                            
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6, fontSize: 11, color: '#64748b' }}>
                                <Calendar size={12} style={{ marginTop: 1, flexShrink: 0 }} />
                                <span style={{ lineHeight: 1.4 }}>{doctor.available_days?.join(', ') || 'No days set'}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 11, color: '#64748b' }}>
                                <Clock size={12} />
                                <span>{doctor.time_start} - {doctor.time_end}</span>
                            </div>

                            <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => handleDelete(doctor.id)} className="admin-btn admin-btn--danger" style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: 12 }}>
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-backdrop" onClick={closeModal} />
                    <div className="admin-modal-box" style={{ maxWidth: 600 }}>
                        <div className="admin-modal-body">
                            <div className="admin-modal-header">
                                <div className="admin-modal-header__info">
                                    <div className="admin-modal-header__icon">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="admin-modal-header__title">
                                            Add New Doctor
                                        </p>
                                        <p className="admin-modal-header__subtitle">
                                            Add a new doctor to your team
                                        </p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="admin-modal-close" disabled={saving}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form id="doctor-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Doctor Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="admin-input"
                                    placeholder="Dr. John Doe"
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Qualification</label>
                                <input
                                    type="text"
                                    value={qualification}
                                    onChange={e => setQualification(e.target.value)}
                                    className="admin-input"
                                    placeholder="MBBS, MD Psychiatry"
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Caption</label>
                                <input
                                    type="text"
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    className="admin-input"
                                    placeholder="Mental Health Specialist"
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Display Order (Rank)</label>
                                <input
                                    type="number"
                                    value={rank}
                                    onChange={e => setRank(parseInt(e.target.value) || 999)}
                                    className="admin-input"
                                    placeholder="1"
                                    min="1"
                                    disabled={saving}
                                />
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Lower numbers appear first (1, 2, 3...)</p>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="admin-textarea"
                                    rows={4}
                                    placeholder="Brief description about the doctor's expertise..."
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Photo</label>
                                <div className="admin-file-input">
                                    <ImageIcon size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                        disabled={saving}
                                    />
                                    <span>{imageFile ? imageFile.name : 'Choose a photo'}</span>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Available Days *</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {WEEKDAYS.map(day => (
                                        <label
                                            key={day}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '12px 16px',
                                                borderRadius: 8,
                                                border: '2px solid',
                                                borderColor: availableDays.includes(day) ? '#133882' : '#e2e8f0',
                                                background: availableDays.includes(day) ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                userSelect: 'none',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={availableDays.includes(day)}
                                                onChange={() => toggleDay(day)}
                                                disabled={saving}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: availableDays.includes(day) ? '#133882' : '#64748b' }}>
                                                {day}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Availability Note</label>
                                <input
                                    type="text"
                                    value={availabilityNote}
                                    onChange={e => setAvailabilityNote(e.target.value)}
                                    className="admin-input"
                                    placeholder="e.g., except 2nd Wednesdays onwards"
                                    disabled={saving}
                                />
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Optional clarification for available days</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Start Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={timeStart}
                                        onChange={e => setTimeStart(e.target.value)}
                                        className="admin-input"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">End Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={timeEnd}
                                        onChange={e => setTimeEnd(e.target.value)}
                                        className="admin-input"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                                    Additional Locations
                                </label>
                                {additionalLocations.map((loc, index) => (
                                    <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <input
                                                type="text"
                                                value={loc.label}
                                                onChange={e => {
                                                    const newLocations = [...additionalLocations];
                                                    newLocations[index].label = e.target.value;
                                                    setAdditionalLocations(newLocations);
                                                }}
                                                className="admin-input"
                                                placeholder="Location Name (e.g., Overseas - Sharjah)"
                                                disabled={saving}
                                                style={{ marginBottom: 0 }}
                                            />
                                            <input
                                                type="text"
                                                value={loc.description}
                                                onChange={e => {
                                                    const newLocations = [...additionalLocations];
                                                    newLocations[index].description = e.target.value;
                                                    setAdditionalLocations(newLocations);
                                                }}
                                                className="admin-input"
                                                placeholder="Details (e.g., Rayhan Gulf Medical Center, 1st Wed–Sat/month)"
                                                disabled={saving}
                                                style={{ marginBottom: 0 }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newLocations = additionalLocations.filter((_, i) => i !== index);
                                                setAdditionalLocations(newLocations);
                                            }}
                                            className="admin-btn admin-btn--danger admin-btn--icon"
                                            style={{ alignSelf: 'flex-start' }}
                                            disabled={saving}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setAdditionalLocations([...additionalLocations, { label: '', description: '' }])}
                                    className="admin-btn admin-btn--ghost"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    disabled={saving}
                                >
                                    <Plus size={16} />
                                    <span>Add Location</span>
                                </button>
                            </div>

                        </form>

                        <div className="admin-modal-footer">
                            <button type="button" onClick={closeModal} className="admin-btn admin-btn--ghost" disabled={saving}>
                                Cancel
                            </button>
                            <button form="doctor-form" type="submit" className="admin-btn admin-btn--primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
                                {saving ? 'Saving...' : 'Add Doctor'}
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;
