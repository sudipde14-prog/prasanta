'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { partiesAPI, itemsAPI, purchasesAPI, Party, Item } from '@/lib/api';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export default function NewPurchasePage() {
    const router = useRouter();
    const [parties, setParties] = useState<Party[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        party_id: '',
        item_id: '',
        quantity: '',
        unit: 'KG',
        rate: '',
        notes: '',
    });

    const [calculatedTotal, setCalculatedTotal] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const qty = parseFloat(formData.quantity) || 0;
        const rate = parseFloat(formData.rate) || 0;
        setCalculatedTotal(qty * rate);
    }, [formData.quantity, formData.rate]);

    async function loadData() {
        try {
            setLoading(true);
            const [partiesData, itemsData] = await Promise.all([
                partiesAPI.getAll(),
                itemsAPI.getAll(),
            ]);
            setParties(partiesData);
            setItems(itemsData);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Could not load shops/items. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-set unit when item changes
        if (name === 'item_id') {
            const selectedItem = items.find(i => i.id === value);
            if (selectedItem) {
                setFormData(prev => ({ ...prev, [name]: value, unit: selectedItem.default_unit }));
            }
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.party_id) {
            setError('Please select a shop');
            return;
        }
        if (!formData.item_id) {
            setError('Please select an item');
            return;
        }
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
            setError('Please enter quantity');
            return;
        }
        if (!formData.rate || parseFloat(formData.rate) <= 0) {
            setError('Please enter rate');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await purchasesAPI.create({
                date: formData.date,
                party_id: formData.party_id,
                item_id: formData.item_id,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                rate: parseFloat(formData.rate),
                notes: formData.notes || undefined,
            });

            router.push('/');
        } catch (err) {
            console.error('Error creating purchase:', err);
            setError('Could not save purchase. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
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
                    <button
                        onClick={() => router.back()}
                        className="btn btn-secondary"
                        style={{ width: '48px', padding: '12px' }}
                    >
                        <BackIcon />
                    </button>
                    <h1 className="page-title">Add Purchase</h1>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {/* Check if shops/items exist */}
                {parties.length === 0 || items.length === 0 ? (
                    <div className="card text-center">
                        <div className="empty-state">
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                            <h3 className="mb-md">Setup Required</h3>
                            {parties.length === 0 && (
                                <p className="text-light mb-md">Add shops first before making purchases</p>
                            )}
                            {items.length === 0 && (
                                <p className="text-light mb-md">Add items first before making purchases</p>
                            )}
                            <div className="flex flex-col gap-md">
                                {parties.length === 0 && (
                                    <button className="btn btn-primary" onClick={() => router.push('/parties')}>
                                        ➕ Add Shop
                                    </button>
                                )}
                                {items.length === 0 && (
                                    <button className="btn btn-secondary" onClick={() => router.push('/items')}>
                                        ➕ Add Item
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Date */}
                        <div className="form-group">
                            <label className="label">📅 Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        {/* Shop/Party */}
                        <div className="form-group">
                            <label className="label">🏪 Shop / Supplier</label>
                            <select
                                name="party_id"
                                value={formData.party_id}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="">-- Select Shop --</option>
                                {parties.map(party => (
                                    <option key={party.id} value={party.id}>{party.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Item */}
                        <div className="form-group">
                            <label className="label">📦 Item</label>
                            <select
                                name="item_id"
                                value={formData.item_id}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="">-- Select Item --</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} ({item.default_unit})</option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity & Unit */}
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="label">🔢 Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="0"
                                    inputMode="decimal"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">📏 Unit</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="select"
                                >
                                    <option value="KG">KG</option>
                                    <option value="Packet">Packet</option>
                                    <option value="Quintal">Quintal</option>
                                    <option value="Litre">Litre</option>
                                </select>
                            </div>
                        </div>

                        {/* Rate */}
                        <div className="form-group">
                            <label className="label">💰 Rate (per {formData.unit})</label>
                            <input
                                type="number"
                                name="rate"
                                value={formData.rate}
                                onChange={handleChange}
                                className="input"
                                placeholder="0"
                                inputMode="decimal"
                                step="0.01"
                            />
                        </div>

                        {/* Calculated Total */}
                        <div className="stat-card mb-lg">
                            <div className="flex justify-between items-center">
                                <p className="stat-label">Total Amount</p>
                                <p className="stat-value">{formatAmount(calculatedTotal)}</p>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="form-group">
                            <label className="label">📝 Notes (optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="textarea"
                                placeholder="Any extra details..."
                                rows={2}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-success btn-lg"
                            disabled={submitting}
                            style={{ marginTop: 'var(--space-lg)' }}
                        >
                            {submitting ? 'Saving...' : '✅ Save Purchase'}
                        </button>
                    </form>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
