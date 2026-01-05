'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { purchasesAPI, Purchase } from '@/lib/api';

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

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadPurchases();
    }, [page]);

    async function loadPurchases() {
        try {
            setLoading(true);
            setError(null);
            const response = await purchasesAPI.getAll({ page, limit: 20 });

            if (page === 1) {
                setPurchases(response.data);
            } else {
                setPurchases(prev => [...prev, ...response.data]);
            }

            setHasMore(page < response.pagination.pages);
        } catch (err) {
            console.error('Error loading purchases:', err);
            setError('Could not load purchases. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this purchase? Stock will be recalculated.')) return;

        try {
            await purchasesAPI.delete(id);
            setPurchases(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting purchase:', err);
            setError('Could not delete. Please try again.');
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

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <Link href="/more" className="btn btn-secondary" style={{ width: '48px', padding: '12px' }}>
                        <BackIcon />
                    </Link>
                    <h1 className="page-title">📋 History</h1>
                    <Link href="/purchases/new" className="btn btn-primary" style={{ width: '48px', padding: '12px' }}>
                        <PlusIcon />
                    </Link>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {loading && page === 1 ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : purchases.length === 0 ? (
                    <div className="card text-center">
                        <div className="empty-state">
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                            <h3>No Purchases Yet</h3>
                            <p className="text-light mt-md">Your purchase history will appear here</p>
                            <Link href="/purchases/new" className="btn btn-primary mt-lg" style={{ textDecoration: 'none' }}>
                                ➕ Add Purchase
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        {purchases.map((purchase) => (
                            <div key={purchase.id} className="list-item">
                                <div className="list-item-icon">📦</div>
                                <div className="list-item-content">
                                    <p className="list-item-title">{purchase.item?.name || 'Item'}</p>
                                    <p className="list-item-subtitle">
                                        {purchase.party?.name || 'Shop'} • {formatDate(purchase.date)}
                                    </p>
                                    <p className="text-sm text-light">
                                        {purchase.quantity} {purchase.unit} @ {formatAmount(purchase.rate)}
                                    </p>
                                </div>
                                <div className="list-item-value">
                                    <p className="font-bold">{formatAmount(purchase.total)}</p>
                                    <button
                                        onClick={() => handleDelete(purchase.id)}
                                        className="btn btn-secondary mt-sm"
                                        style={{ width: '32px', height: '32px', padding: '4px', minHeight: 'auto', fontSize: '14px' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="btn btn-secondary mt-lg"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        )}
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
