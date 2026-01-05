'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { settingsAPI, stockAPI, itemsAPI, Stock, Item } from '@/lib/api';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function SettingsPage() {
    const [pinSet, setPinSet] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [stockItems, setStockItems] = useState<Stock[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [newQuantity, setNewQuantity] = useState('');
    const [adjustReason, setAdjustReason] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            const [pinStatus, stockData, itemsData] = await Promise.all([
                settingsAPI.checkPin().catch(() => ({ pin_set: false })),
                stockAPI.getAll().catch(() => []),
                itemsAPI.getAll().catch(() => []),
            ]);
            setPinSet(pinStatus.pin_set);
            setStockItems(stockData);
            setItems(itemsData);
        } catch (err) {
            console.error('Error loading settings:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSetPin() {
        if (pinInput.length !== 4 || !/^\d+$/.test(pinInput)) {
            setError('PIN must be 4 digits');
            return;
        }

        try {
            await settingsAPI.setPin(pinInput);
            setPinSet(true);
            setShowPinModal(false);
            setPinInput('');
            setSuccess('PIN set successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error setting PIN:', err);
            setError('Could not set PIN. Try again.');
        }
    }

    async function handleRemovePin() {
        if (!confirm('Remove PIN lock?')) return;

        try {
            await settingsAPI.removePin();
            setPinSet(false);
            setSuccess('PIN removed!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error removing PIN:', err);
            setError('Could not remove PIN.');
        }
    }

    async function handleStockAdjust() {
        if (!selectedItem || !newQuantity) {
            setError('Select item and enter quantity');
            return;
        }

        try {
            await stockAPI.adjust(selectedItem, {
                total_quantity: parseFloat(newQuantity),
                reason: adjustReason || 'Manual adjustment',
            });
            setShowStockModal(false);
            setSelectedItem('');
            setNewQuantity('');
            setAdjustReason('');
            loadSettings();
            setSuccess('Stock adjusted!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error adjusting stock:', err);
            setError('Could not adjust stock.');
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
                    <h1 className="page-title">⚙️ Settings</h1>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                        <button onClick={() => setError(null)} className="btn btn-secondary mt-sm" style={{ padding: '8px 12px', minHeight: 'auto' }}>OK</button>
                    </div>
                )}

                {success && (
                    <div className="card mb-md" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                        <p className="text-success">{success}</p>
                    </div>
                )}

                {/* PIN Lock */}
                <div className="card mb-md">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3>🔒 PIN Lock</h3>
                            <p className="text-light text-sm mt-sm">
                                {pinSet ? 'PIN is active' : 'No PIN set'}
                            </p>
                        </div>
                        {pinSet ? (
                            <button onClick={handleRemovePin} className="btn btn-danger" style={{ padding: '8px 16px', minHeight: 'auto', width: 'auto' }}>
                                Remove
                            </button>
                        ) : (
                            <button onClick={() => setShowPinModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', minHeight: 'auto', width: 'auto' }}>
                                Set PIN
                            </button>
                        )}
                    </div>
                </div>

                {/* Stock Adjustment */}
                <div className="card mb-md">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3>📦 Stock Adjustment</h3>
                            <p className="text-light text-sm mt-sm">
                                Manually correct stock quantities
                            </p>
                        </div>
                        <button onClick={() => setShowStockModal(true)} className="btn btn-secondary" style={{ padding: '8px 16px', minHeight: 'auto', width: 'auto' }}>
                            Adjust
                        </button>
                    </div>
                </div>

                {/* App Info */}
                <div className="card text-center mt-lg">
                    <h3>📒 Ledger Book</h3>
                    <p className="text-light mt-sm">Version 1.0.0</p>
                    <p className="text-light text-sm mt-md">
                        Simple inventory & ledger software<br />
                        for small shop owners
                    </p>
                </div>
            </div>

            {/* PIN Modal */}
            {showPinModal && (
                <div className="modal-overlay" onClick={() => setShowPinModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Set 4-Digit PIN</h2>
                            <button onClick={() => setShowPinModal(false)} className="modal-close">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="label">Enter PIN</label>
                            <input
                                type="password"
                                value={pinInput}
                                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="input text-center"
                                placeholder="••••"
                                maxLength={4}
                                inputMode="numeric"
                                style={{ fontSize: 'var(--font-size-2xl)', letterSpacing: '8px' }}
                                autoFocus
                            />
                        </div>

                        <button onClick={handleSetPin} className="btn btn-success btn-lg">
                            ✅ Set PIN
                        </button>
                    </div>
                </div>
            )}

            {/* Stock Adjustment Modal */}
            {showStockModal && (
                <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Adjust Stock</h2>
                            <button onClick={() => setShowStockModal(false)} className="modal-close">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="label">Select Item</label>
                            <select
                                value={selectedItem}
                                onChange={(e) => {
                                    setSelectedItem(e.target.value);
                                    const stock = stockItems.find(s => s.item_id === e.target.value);
                                    if (stock) setNewQuantity(stock.total_quantity.toString());
                                }}
                                className="select"
                            >
                                <option value="">-- Select Item --</option>
                                {items.map(item => {
                                    const stock = stockItems.find(s => s.item_id === item.id);
                                    return (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (Current: {stock?.total_quantity || 0} {item.default_unit})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label">New Quantity</label>
                            <input
                                type="number"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                className="input"
                                placeholder="0"
                                inputMode="decimal"
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Reason (optional)</label>
                            <input
                                type="text"
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                                className="input"
                                placeholder="e.g., Stock count correction"
                            />
                        </div>

                        <button onClick={handleStockAdjust} className="btn btn-success btn-lg">
                            ✅ Update Stock
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
