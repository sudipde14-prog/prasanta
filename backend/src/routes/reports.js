const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Daily purchase summary
router.get('/daily', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const { data: purchases, error } = await supabase
            .from('purchases')
            .select(`
        *,
        party:parties(name),
        item:items(name, default_unit)
      `)
            .eq('date', targetDate)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const summary = {
            date: targetDate,
            total_entries: purchases.length,
            total_amount: purchases.reduce((sum, p) => sum + parseFloat(p.total || 0), 0),
            by_item: {}
        };

        // Group by item
        purchases.forEach(p => {
            const itemName = p.item?.name || 'Unknown';
            if (!summary.by_item[itemName]) {
                summary.by_item[itemName] = { quantity: 0, amount: 0, unit: p.unit };
            }
            summary.by_item[itemName].quantity += parseFloat(p.quantity || 0);
            summary.by_item[itemName].amount += parseFloat(p.total || 0);
        });

        res.json({ purchases, summary });
    } catch (error) {
        console.error('Error fetching daily report:', error);
        res.status(500).json({ error: error.message });
    }
});

// Monthly purchase summary
router.get('/monthly', async (req, res) => {
    try {
        const { year, month } = req.query;
        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month || (now.getMonth() + 1);

        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

        const { data: purchases, error } = await supabase
            .from('purchases')
            .select(`
        *,
        party:parties(name),
        item:items(name, default_unit)
      `)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false });

        if (error) throw error;

        const summary = {
            year: parseInt(targetYear),
            month: parseInt(targetMonth),
            total_entries: purchases.length,
            total_amount: purchases.reduce((sum, p) => sum + parseFloat(p.total || 0), 0),
            by_item: {},
            by_party: {},
            by_date: {}
        };

        // Group by item, party, and date
        purchases.forEach(p => {
            const itemName = p.item?.name || 'Unknown';
            const partyName = p.party?.name || 'Unknown';
            const date = p.date;

            // By item
            if (!summary.by_item[itemName]) {
                summary.by_item[itemName] = { quantity: 0, amount: 0, unit: p.unit };
            }
            summary.by_item[itemName].quantity += parseFloat(p.quantity || 0);
            summary.by_item[itemName].amount += parseFloat(p.total || 0);

            // By party
            if (!summary.by_party[partyName]) {
                summary.by_party[partyName] = { entries: 0, amount: 0 };
            }
            summary.by_party[partyName].entries += 1;
            summary.by_party[partyName].amount += parseFloat(p.total || 0);

            // By date
            if (!summary.by_date[date]) {
                summary.by_date[date] = { entries: 0, amount: 0 };
            }
            summary.by_date[date].entries += 1;
            summary.by_date[date].amount += parseFloat(p.total || 0);
        });

        res.json({ purchases, summary });
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        res.status(500).json({ error: error.message });
    }
});

// Item-wise total summary
router.get('/item-wise', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = supabase
            .from('purchases')
            .select(`
        item_id,
        quantity,
        total,
        unit,
        item:items(name, default_unit)
      `);

        if (start_date) query = query.gte('date', start_date);
        if (end_date) query = query.lte('date', end_date);

        const { data: purchases, error } = await query;

        if (error) throw error;

        // Aggregate by item
        const itemSummary = {};
        purchases.forEach(p => {
            const itemId = p.item_id;
            if (!itemSummary[itemId]) {
                itemSummary[itemId] = {
                    item_id: itemId,
                    name: p.item?.name || 'Unknown',
                    unit: p.item?.default_unit || p.unit,
                    total_quantity: 0,
                    total_amount: 0,
                    purchase_count: 0
                };
            }
            itemSummary[itemId].total_quantity += parseFloat(p.quantity || 0);
            itemSummary[itemId].total_amount += parseFloat(p.total || 0);
            itemSummary[itemId].purchase_count += 1;
        });

        res.json(Object.values(itemSummary));
    } catch (error) {
        console.error('Error fetching item-wise report:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
