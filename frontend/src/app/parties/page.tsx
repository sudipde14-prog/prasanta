'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { partiesAPI, Party } from '@/lib/api';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function PartiesPage() {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'supplier',
        address: '',
        phone: '',
        notes: '',
    });

    useEffect(() => {
        loadParties();
    }, []);

    async function loadParties() {
        try {
            setLoading(true);
            setError(null);
            const data = await partiesAPI.getAll();
            setParties(data);
        } catch (err) {
            console.error('Error loading parties:', err);
            setError('Could not load shops. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function openAddModal() {
        setEditingParty(null);
        setFormData({ name: '', type: 'supplier', address: '', phone: '', notes: '' });
        setShowModal(true);
    }

    function openEditModal(party: Party) {
        setEditingParty(party);
        setFormData({
            name: party.name,
            type: party.type || 'supplier',
            address: party.address || '',
            phone: party.phone || '',
            notes: party.notes || '',
        });
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            if (editingParty) {
                await partiesAPI.update(editingParty.id, formData);
            } else {
                await partiesAPI.create(formData);
            }

            setShowModal(false);
            loadParties();
        } catch (err) {
            console.error('Error saving party:', err);
            setError('Could not save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this shop? This cannot be undone.')) return;

        try {
            await partiesAPI.delete(id);
            loadParties();
        } catch (err) {
            console.error('Error deleting party:', err);
            setError('Could not delete. May have linked purchases.');
        }
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading"><div className="spinner"></div></div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <Link href="/more" className="btn btn-secondary" style={{ width: '48px', padding: '12px' }}>
                        <BackIcon />
                    </Link>
                    <h1 className="page-title">🏪 Shops</h1>
                    <button onClick={openAddModal} className="btn btn-primary" style={{ width: '48px', padding: '12px' }}>
                        <PlusIcon />
                    </button>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {parties.length === 0 ? (
                    <div className="card text-center">
                        <div className="empty-state">
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
                            <h3>No Shops Yet</h3>
                            <p className="text-light mt-md">Add your suppliers and shops</p>
                            <button onClick={openAddModal} className="btn btn-primary mt-lg">
                                ➕ Add Shop
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {parties.map((party) => (
                            <div key={party.id} className="list-item" onClick={() => openEditModal(party)}>
                                <div className="list-item-icon">🏪</div>
                                <div className="list-item-content">
                                    <p className="list-item-title">{party.name}</p>
                                    <p className="list-item-subtitle">
                                        {party.phone || party.address || 'No details'}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(party.id); }}
                                    className="btn btn-secondary"
                                    style={{ width: '40px', height: '40px', padding: '8px', minHeight: 'auto' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingParty ? 'Edit Shop' : 'Add Shop'}</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">
                                <CloseIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="label">Shop Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Enter shop name"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="select">
                                    <option value="supplier">Supplier</option>
                                    <option value="both">Both (Supplier & Customer)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">📞 Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">📍 Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="textarea"
                                    placeholder="Address"
                                    rows={2}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">📝 Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="textarea"
                                    placeholder="Any notes..."
                                    rows={2}
                                />
                            </div>

                            <button type="submit" className="btn btn-success btn-lg" disabled={submitting}>
                                {submitting ? 'Saving...' : '✅ Save'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
