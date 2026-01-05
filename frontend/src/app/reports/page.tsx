'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { reportsAPI } from '@/lib/api';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

interface DailySummary {
    date: string;
    total_entries: number;
    total_amount: number;
    by_item: Record<string, { quantity: number; amount: number; unit: string }>;
}

interface ItemSummary {
    item_id: string;
    name: string;
    unit: string;
    total_quantity: number;
    total_amount: number;
    purchase_count: number;
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'items'>('daily');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const [dailyData, setDailyData] = useState<DailySummary | null>(null);
    const [monthlyData, setMonthlyData] = useState<{ summary: Record<string, unknown> } | null>(null);
    const [itemsData, setItemsData] = useState<ItemSummary[]>([]);

    useEffect(() => {
        loadData();
    }, [activeTab, selectedDate, selectedYear, selectedMonth]);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            if (activeTab === 'daily') {
                const response = await reportsAPI.daily(selectedDate);
                setDailyData(response.summary as DailySummary);
            } else if (activeTab === 'monthly') {
                const response = await reportsAPI.monthly(selectedYear, selectedMonth);
                setMonthlyData(response);
            } else if (activeTab === 'items') {
                const response = await reportsAPI.itemWise();
                setItemsData(response);
            }
        } catch (err) {
            console.error('Error loading report:', err);
            setError('Could not load report data.');
        } finally {
            setLoading(false);
        }
    }

    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    }

    function exportToCSV() {
        let csvContent = '';
        let filename = '';

        if (activeTab === 'items' && itemsData.length > 0) {
            csvContent = 'Item,Unit,Total Quantity,Total Amount,Purchases\n';
            itemsData.forEach(item => {
                csvContent += `"${item.name}","${item.unit}",${item.total_quantity},${item.total_amount},${item.purchase_count}\n`;
            });
            filename = 'items_report.csv';
        } else if (activeTab === 'daily' && dailyData) {
            csvContent = `Date: ${dailyData.date}\nTotal Amount: ${dailyData.total_amount}\nTotal Entries: ${dailyData.total_entries}\n\nItem,Quantity,Unit,Amount\n`;
            Object.entries(dailyData.by_item).forEach(([name, data]) => {
                csvContent += `"${name}",${data.quantity},"${data.unit}",${data.amount}\n`;
            });
            filename = `daily_report_${dailyData.date}.csv`;
        }

        if (csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <Link href="/more" className="btn btn-secondary" style={{ width: '48px', padding: '12px' }}>
                        <BackIcon />
                    </Link>
                    <h1 className="page-title">📊 Reports</h1>
                </div>

                {/* Tabs */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-lg)' }}>
                    {['daily', 'monthly', 'items'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'daily' | 'monthly' | 'items')}
                            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="card mb-md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {/* Date/Month Selection */}
                {activeTab === 'daily' && (
                    <div className="form-group">
                        <label className="label">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input"
                        />
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div className="grid grid-2 mb-lg">
                        <div className="form-group">
                            <label className="label">Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="select"
                            >
                                {[2024, 2025, 2026, 2027].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label">Month</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="select"
                            >
                                {months.map((month, idx) => (
                                    <option key={idx + 1} value={idx + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Report Content */}
                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : (
                    <>
                        {/* Daily Report */}
                        {activeTab === 'daily' && dailyData && (
                            <div>
                                <div className="stat-card mb-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="stat-label">Total for {selectedDate}</p>
                                            <p className="stat-value">{formatAmount(dailyData.total_amount)}</p>
                                            <p className="stat-label">{dailyData.total_entries} entries</p>
                                        </div>
                                        <div style={{ fontSize: '48px' }}>📅</div>
                                    </div>
                                </div>

                                {Object.entries(dailyData.by_item).length > 0 && (
                                    <>
                                        <h3 className="mb-md">By Item</h3>
                                        {Object.entries(dailyData.by_item).map(([name, data]) => (
                                            <div key={name} className="list-item">
                                                <div className="list-item-icon">📦</div>
                                                <div className="list-item-content">
                                                    <p className="list-item-title">{name}</p>
                                                    <p className="list-item-subtitle">{data.quantity} {data.unit}</p>
                                                </div>
                                                <p className="font-bold">{formatAmount(data.amount)}</p>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Monthly Report */}
                        {activeTab === 'monthly' && monthlyData && (
                            <div>
                                <div className="stat-card mb-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="stat-label">{months[selectedMonth - 1]} {selectedYear}</p>
                                            <p className="stat-value">{formatAmount((monthlyData.summary as Record<string, number>).total_amount || 0)}</p>
                                            <p className="stat-label">{(monthlyData.summary as Record<string, number>).total_entries || 0} entries</p>
                                        </div>
                                        <div style={{ fontSize: '48px' }}>📆</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items Report */}
                        {activeTab === 'items' && (
                            <div>
                                {itemsData.length === 0 ? (
                                    <div className="card text-center">
                                        <p className="text-light">No item data available</p>
                                    </div>
                                ) : (
                                    <>
                                        {itemsData.map((item) => (
                                            <div key={item.item_id} className="list-item">
                                                <div className="list-item-icon">📦</div>
                                                <div className="list-item-content">
                                                    <p className="list-item-title">{item.name}</p>
                                                    <p className="list-item-subtitle">
                                                        {item.total_quantity.toLocaleString()} {item.unit} • {item.purchase_count} purchases
                                                    </p>
                                                </div>
                                                <p className="font-bold">{formatAmount(item.total_amount)}</p>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Export Button */}
                        <button onClick={exportToCSV} className="btn btn-secondary mt-lg">
                            📥 Export CSV
                        </button>
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
