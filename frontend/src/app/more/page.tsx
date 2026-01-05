'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';

// Icons  
const PartyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    </svg>
);

const ItemIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    </svg>
);

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const LedgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

interface MenuItem {
    href: string;
    icon: React.ComponentType;
    label: string;
    description: string;
    emoji: string;
}

const menuItems: MenuItem[] = [
    { href: '/parties', icon: PartyIcon, label: 'Shops / Suppliers', description: 'Manage your suppliers', emoji: '🏪' },
    { href: '/items', icon: ItemIcon, label: 'Items / Products', description: 'Manage products list', emoji: '📦' },
    { href: '/purchases', icon: HistoryIcon, label: 'Purchase History', description: 'View all purchases', emoji: '📋' },
    { href: '/ledger', icon: LedgerIcon, label: 'Shop Ledger', description: 'Party-wise history', emoji: '📒' },
    { href: '/reports', icon: ReportIcon, label: 'Reports', description: 'Daily & monthly summaries', emoji: '📊' },
    { href: '/settings', icon: SettingsIcon, label: 'Settings', description: 'PIN lock & adjustments', emoji: '⚙️' },
];

export default function MorePage() {
    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">More Options</h1>
                </div>

                {/* Menu Items */}
                <div>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="list-item"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="list-item-icon">
                                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                            </div>
                            <div className="list-item-content">
                                <p className="list-item-title">{item.label}</p>
                                <p className="list-item-subtitle">{item.description}</p>
                            </div>
                            <ArrowIcon />
                        </Link>
                    ))}
                </div>

                {/* App Info */}
                <div className="card mt-lg text-center">
                    <p className="text-light text-sm">Ledger Book v1.0</p>
                    <p className="text-light text-sm">Simple inventory for your shop</p>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
