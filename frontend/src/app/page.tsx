'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { stockAPI, purchasesAPI, partiesAPI, itemsAPI, Stock, Purchase } from '@/lib/api';

// Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface DashboardStats {
  totalStock: number;
  todayPurchases: number;
  todayAmount: number;
  totalParties: number;
  totalItems: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStock: 0,
    todayPurchases: 0,
    todayAmount: 0,
    totalParties: 0,
    totalItems: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];

      const [stockData, purchasesData, partiesData, itemsData] = await Promise.all([
        stockAPI.getAll().catch(() => [] as Stock[]),
        purchasesAPI.getAll({ limit: 5, start_date: today, end_date: today }).catch(() => ({ data: [], pagination: { total: 0 } })),
        partiesAPI.getAll().catch(() => []),
        itemsAPI.getAll().catch(() => []),
      ]);

      const totalStock = (stockData as Stock[]).reduce((sum: number, s: Stock) => sum + s.total_quantity, 0);
      const todayAmount = purchasesData.data.reduce((sum: number, p: Purchase) => sum + p.total, 0);

      setStats({
        totalStock,
        todayPurchases: purchasesData.pagination.total,
        todayAmount,
        totalParties: partiesData.length,
        totalItems: itemsData.length,
      });

      // Get recent purchases (all time, not just today)
      const allPurchases = await purchasesAPI.getAll({ limit: 5 }).catch(() => ({ data: [] }));
      setRecentPurchases(allPurchases.data);

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Could not load data. Check your connection.');
    } finally {
      setLoading(false);
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

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
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
          <h1 className="page-title">📒 Ledger Book</h1>
        </div>

        {error && (
          <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <p className="text-danger">{error}</p>
            <button className="btn btn-secondary mt-md" onClick={loadDashboard}>
              Try Again
            </button>
          </div>
        )}

        {/* Today's Stats */}
        <div className="stat-card mb-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="stat-label">Today&apos;s Purchases</p>
              <p className="stat-value">{formatAmount(stats.todayAmount)}</p>
              <p className="stat-label">{stats.todayPurchases} entries</p>
            </div>
            <div style={{ fontSize: '48px' }}>🛒</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="mb-md" style={{ fontSize: 'var(--font-size-lg)' }}>Quick Actions</h2>
        <div className="grid grid-2 mb-lg">
          <Link href="/purchases/new" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            <PlusIcon />
            Add Purchase
          </Link>
          <Link href="/stock" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
            <BoxIcon />
            View Stock
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-2 mb-lg">
          <div className="card text-center">
            <p className="text-light text-sm">Shops</p>
            <p className="text-xl font-bold">{stats.totalParties}</p>
          </div>
          <div className="card text-center">
            <p className="text-light text-sm">Items</p>
            <p className="text-xl font-bold">{stats.totalItems}</p>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="flex justify-between items-center mb-md">
          <h2 style={{ fontSize: 'var(--font-size-lg)' }}>Recent Purchases</h2>
          <Link href="/purchases" className="text-primary flex items-center gap-sm">
            View All <ArrowRightIcon />
          </Link>
        </div>

        {recentPurchases.length === 0 ? (
          <div className="card text-center">
            <div className="empty-state">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <p className="text-light">No purchases yet</p>
              <Link href="/purchases/new" className="btn btn-primary mt-md" style={{ textDecoration: 'none' }}>
                Add First Purchase
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {recentPurchases.map((purchase) => (
              <Link
                href={`/purchases/${purchase.id}`}
                key={purchase.id}
                className="list-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="list-item-icon">
                  📦
                </div>
                <div className="list-item-content">
                  <p className="list-item-title">{purchase.item?.name || 'Item'}</p>
                  <p className="list-item-subtitle">
                    {purchase.party?.name || 'Shop'} • {formatDate(purchase.date)}
                  </p>
                </div>
                <div className="list-item-value">
                  <p className="font-bold">{formatAmount(purchase.total)}</p>
                  <p className="text-sm text-light">{purchase.quantity} {purchase.unit}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
