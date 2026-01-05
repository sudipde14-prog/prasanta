'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { itemsAPI, Item } from '@/lib/api';

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

export default function ItemsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        default_unit: 'KG',
        notes: '',
    });

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            setLoading(true);
            setError(null);
            const data = await itemsAPI.getAll();
            setItems(data);
        } catch (err) {
            console.error('Error loading items:', err);
            setError('Could not load items. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function openAddModal() {
        setEditingItem(null);
        setFormData({ name: '', default_unit: 'KG', notes: '' });
        setShowModal(true);
    }

    function openEditModal(item: Item) {
        setEditingItem(item);
        setFormData({
            name: item.name,
            default_unit: item.default_unit || 'KG',
            notes: item.notes || '',
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



            // Explicitly cast default_unit to match the expected union type
            const itemData = {
                ...formData,
                default_unit: formData.default_unit as "KG" | "Packet" | "Quintal" | "Litre"
            };

            if (editingItem) {
                await itemsAPI.update(editingItem.id, itemData);
            } else {
                await itemsAPI.create(itemData);
            }

            setShowModal(false);
            loadItems();
        } catch (err) {
            console.error('Error saving item:', err);
            setError('Could not save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this item? Stock data will also be deleted.')) return;

        try {
            await itemsAPI.delete(id);
            loadItems();
        } catch (err) {
            console.error('Error deleting item:', err);
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
                    <h1 className="page-title">📦 Items</h1>
                    <button onClick={openAddModal} className="btn btn-primary" style={{ width: '48px', padding: '12px' }}>
                        <PlusIcon />
                    </button>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="card text-center">
                        <div className="empty-state">
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                            <h3>No Items Yet</h3>
                            <p className="text-light mt-md">Add products you buy regularly</p>
                            <button onClick={openAddModal} className="btn btn-primary mt-lg">
                                ➕ Add Item
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {items.map((item) => (
                            <div key={item.id} className="list-item" onClick={() => openEditModal(item)}>
                                <div className="list-item-icon">📦</div>
                                <div className="list-item-content">
                                    <p className="list-item-title">{item.name}</p>
                                    <p className="list-item-subtitle">Unit: {item.default_unit}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
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
                            <h2 className="modal-title">{editingItem ? 'Edit Item' : 'Add Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">
                                <CloseIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="label">Item Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., Rice, Sugar, Wheat"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Default Unit</label>
                                <select name="default_unit" value={formData.default_unit} onChange={handleChange} className="select">
                                    <option value="KG">KG (Kilogram)</option>
                                    <option value="Packet">Packet</option>
                                    <option value="Quintal">Quintal</option>
                                    <option value="Litre">Litre</option>
                                </select>
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
