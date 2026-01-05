'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { stockAPI, Stock } from '@/lib/api';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export default function StockPage() {
    const [stockItems, setStockItems] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStock();
    }, []);

    async function loadStock() {
        try {
            setLoading(true);
            setError(null);
            const data = await stockAPI.getAll();
            setStockItems(data);
        } catch (err) {
            console.error('Error loading stock:', err);
            setError('Could not load stock. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    <Link
                        href="/"
                        className="btn btn-secondary"
                        style={{ width: '48px', padding: '12px' }}
                    >
                        <BackIcon />
                    </Link>
                    <h1 className="page-title">📦 Stock</h1>
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                        <button className="btn btn-secondary mt-md" onClick={loadStock}>
                            Try Again
                        </button>
                    </div>
                )}

                {stockItems.length === 0 ? (
                    <div className="card text-center">
                        <div className="empty-state">
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                            <h3>No Stock Yet</h3>
                            <p className="text-light mt-md">Add items and record purchases to see stock here</p>
                            <Link href="/purchases/new" className="btn btn-primary mt-lg" style={{ textDecoration: 'none' }}>
                                ➕ Add Purchase
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Summary Card */}
                        <div className="stat-card mb-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="stat-label">Total Items</p>
                                    <p className="stat-value">{stockItems.length}</p>
                                </div>
                                <div style={{ fontSize: '48px' }}>📊</div>
                            </div>
                        </div>

                        {/* Stock List */}
                        <div>
                            {stockItems.map((stock) => (
                                <div key={stock.item_id} className="list-item">
                                    <div className="list-item-icon">
                                        📦
                                    </div>
                                    <div className="list-item-content">
                                        <p className="list-item-title">{stock.item?.name || 'Unknown Item'}</p>
                                        <p className="list-item-subtitle text-light">
                                            Last updated: {new Date(stock.updated_at).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="list-item-value">
                                        <p className="font-bold text-xl" style={{ color: stock.total_quantity > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            {stock.total_quantity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-sm text-light">{stock.item?.default_unit || 'units'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
