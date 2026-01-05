const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || error.error || 'Request failed');
    }

    return response.json();
}

// Types
export interface Party {
    id: string;
    name: string;
    type: 'supplier' | 'both';
    address?: string;
    phone?: string;
    notes?: string;
    created_at: string;
}

export interface Item {
    id: string;
    name: string;
    default_unit: 'KG' | 'Packet' | 'Quintal' | 'Litre';
    notes?: string;
    created_at: string;
}

export interface Purchase {
    id: string;
    date: string;
    party_id: string;
    item_id: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    notes?: string;
    created_at: string;
    party?: Party;
    item?: Item;
}

export interface Stock {
    item_id: string;
    total_quantity: number;
    updated_at: string;
    item?: Item;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface LedgerResponse {
    party: Party;
    purchases: Purchase[];
    summary: {
        total_entries: number;
        total_quantity: number;
        total_amount: number;
    };
}

// Parties API
export const partiesAPI = {
    getAll: () => fetchAPI<Party[]>('/api/parties'),
    getById: (id: string) => fetchAPI<Party>(`/api/parties/${id}`),
    create: (data: Partial<Party>) => fetchAPI<Party>('/api/parties', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Party>) => fetchAPI<Party>(`/api/parties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI<{ message: string }>(`/api/parties/${id}`, {
        method: 'DELETE',
    }),
};

// Items API
export const itemsAPI = {
    getAll: () => fetchAPI<Item[]>('/api/items'),
    getById: (id: string) => fetchAPI<Item>(`/api/items/${id}`),
    create: (data: Partial<Item>) => fetchAPI<Item>('/api/items', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Item>) => fetchAPI<Item>(`/api/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI<{ message: string }>(`/api/items/${id}`, {
        method: 'DELETE',
    }),
};

// Purchases API
export const purchasesAPI = {
    getAll: (params?: { page?: number; limit?: number; party_id?: string; item_id?: string; start_date?: string; end_date?: string }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchAPI<PaginatedResponse<Purchase>>(`/api/purchases?${searchParams.toString()}`);
    },
    getById: (id: string) => fetchAPI<Purchase>(`/api/purchases/${id}`),
    create: (data: Partial<Purchase>) => fetchAPI<Purchase>('/api/purchases', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Purchase>) => fetchAPI<Purchase>(`/api/purchases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI<{ message: string }>(`/api/purchases/${id}`, {
        method: 'DELETE',
    }),
};

// Stock API
export const stockAPI = {
    getAll: () => fetchAPI<Stock[]>('/api/stock'),
    adjust: (itemId: string, data: { total_quantity: number; reason?: string }) =>
        fetchAPI<Stock>(`/api/stock/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// Ledger API
export const ledgerAPI = {
    getByParty: (partyId: string, params?: { start_date?: string; end_date?: string; item_id?: string }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchAPI<LedgerResponse>(`/api/ledger/${partyId}?${searchParams.toString()}`);
    },
};

// Reports API
export const reportsAPI = {
    daily: (date?: string) => {
        const params = date ? `?date=${date}` : '';
        return fetchAPI<{ purchases: Purchase[]; summary: Record<string, unknown> }>(`/api/reports/daily${params}`);
    },
    monthly: (year?: number, month?: number) => {
        const params = new URLSearchParams();
        if (year) params.append('year', String(year));
        if (month) params.append('month', String(month));
        return fetchAPI<{ purchases: Purchase[]; summary: Record<string, unknown> }>(`/api/reports/monthly?${params.toString()}`);
    },
    itemWise: (params?: { start_date?: string; end_date?: string }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchAPI<Array<{ item_id: string; name: string; unit: string; total_quantity: number; total_amount: number; purchase_count: number }>>(`/api/reports/item-wise?${searchParams.toString()}`);
    },
};

// Settings API
export const settingsAPI = {
    checkPin: () => fetchAPI<{ pin_set: boolean }>('/api/settings/pin'),
    setPin: (pin: string) => fetchAPI<{ message: string }>('/api/settings/pin', {
        method: 'POST',
        body: JSON.stringify({ pin }),
    }),
    verifyPin: (pin: string) => fetchAPI<{ valid: boolean }>('/api/settings/verify-pin', {
        method: 'POST',
        body: JSON.stringify({ pin }),
    }),
    removePin: () => fetchAPI<{ message: string }>('/api/settings/pin', {
        method: 'DELETE',
    }),
};
