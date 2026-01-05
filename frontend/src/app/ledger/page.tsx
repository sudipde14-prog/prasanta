'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { partiesAPI, ledgerAPI, Party, LedgerResponse } from '@/lib/api';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export default function LedgerPage() {
    const [parties, setParties] = useState<Party[]>([]);
    const [selectedParty, setSelectedParty] = useState<string>('');
    const [ledgerData, setLedgerData] = useState<LedgerResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingLedger, setLoadingLedger] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadParties();
    }, []);

    useEffect(() => {
        if (selectedParty) {
            loadLedger();
        }
    }, [selectedParty, startDate, endDate]);

    async function loadParties() {
        try {
            setLoading(true);
            const data = await partiesAPI.getAll();
            setParties(data);
        } catch (err) {
            console.error('Error loading parties:', err);
            setError('Could not load shops.');
        } finally {
            setLoading(false);
        }
    }

    async function loadLedger() {
        if (!selectedParty) return;

        try {
            setLoadingLedger(true);
            setError(null);
            const data = await ledgerAPI.getByParty(selectedParty, {
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            });
            setLedgerData(data);
        } catch (err) {
            console.error('Error loading ledger:', err);
            setError('Could not load ledger data.');
        } finally {
            setLoadingLedger(false);
        }
    }

    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
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
                    <h1 className="page-title">📒 Ledger</h1>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {/* Party Selection */}
                <div className="form-group">
                    <label className="label">🏪 Select Shop</label>
                    <select
                        value={selectedParty}
                        onChange={(e) => setSelectedParty(e.target.value)}
                        className="select"
                    >
                        <option value="">-- Select a shop --</option>
                        {parties.map(party => (
                            <option key={party.id} value={party.id}>{party.name}</option>
                        ))}
                    </select>
                </div>

                {/* Date Filters */}
                {selectedParty && (
                    <div className="grid grid-2 mb-lg">
                        <div className="form-group">
                            <label className="label">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>
                )}

                {/* Ledger Data */}
                {loadingLedger ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : ledgerData ? (
                    <div>
                        {/* Summary Card */}
                        <div className="stat-card mb-lg">
                            <h3 className="mb-md">{ledgerData.party?.name}</h3>
                            <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
                                <div>
                                    <p className="stat-label">Total Quantity</p>
                                    <p className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>
                                        {ledgerData.summary.total_quantity.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="stat-label">Total Amount</p>
                                    <p className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>
                                        {formatAmount(ledgerData.summary.total_amount)}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-md text-sm" style={{ opacity: 0.8 }}>
                                {ledgerData.summary.total_entries} entries
                            </p>
                        </div>

                        {/* Purchase List */}
                        {ledgerData.purchases.length === 0 ? (
                            <div className="card text-center">
                                <p className="text-light">No purchases found for this period</p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="mb-md">Purchase History</h3>
                                {ledgerData.purchases.map((purchase) => (
                                    <div key={purchase.id} className="list-item">
                                        <div className="list-item-icon">📦</div>
                                        <div className="list-item-content">
                                            <p className="list-item-title">{purchase.item?.name}</p>
                                            <p className="list-item-subtitle">{formatDate(purchase.date)}</p>
                                            <p className="text-sm text-light">
                                                {purchase.quantity} {purchase.unit} @ {formatAmount(purchase.rate)}
                                            </p>
                                        </div>
                                        <div className="list-item-value">
                                            <p className="font-bold">{formatAmount(purchase.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : selectedParty ? null : (
                    <div className="card text-center mt-lg">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📒</div>
                        <p className="text-light">Select a shop to view their ledger</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
