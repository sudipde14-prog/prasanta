const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Helper: Update stock for an item
async function updateStock(itemId) {
    try {
        // Get total quantity from all purchases
        const { data: purchases, error: purchaseError } = await supabase
            .from('purchases')
            .select('quantity')
            .eq('item_id', itemId);

        if (purchaseError) throw purchaseError;

        const totalQuantity = purchases.reduce((sum, p) => sum + parseFloat(p.quantity || 0), 0);

        // Update stock table
        const { error: stockError } = await supabase
            .from('stock')
            .upsert({ item_id: itemId, total_quantity: totalQuantity, updated_at: new Date().toISOString() });

        if (stockError) throw stockError;

        return totalQuantity;
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
}

// Get all purchases (with pagination and filters)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, party_id, item_id, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('purchases')
            .select(`
        *,
        party:parties(id, name, address),
        item:items(id, name, default_unit)
      `, { count: 'exact' })
            .order('date', { ascending: false })
            .range(offset, offset + limit - 1);

        if (party_id) query = query.eq('party_id', party_id);
        if (item_id) query = query.eq('item_id', item_id);
        if (start_date) query = query.gte('date', start_date);
        if (end_date) query = query.lte('date', end_date);

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single purchase
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .select(`
        *,
        party:parties(id, name, address),
        item:items(id, name, default_unit)
      `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching purchase:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create purchase
router.post('/', async (req, res) => {
    try {
        const { date, party_id, item_id, quantity, unit, rate, notes } = req.body;

        if (!party_id || !item_id || !quantity || !rate) {
            return res.status(400).json({ error: 'Party, item, quantity, and rate are required' });
        }

        const total = parseFloat(quantity) * parseFloat(rate);

        const { data, error } = await supabase
            .from('purchases')
            .insert([{
                date: date || new Date().toISOString().split('T')[0],
                party_id,
                item_id,
                quantity: parseFloat(quantity),
                unit,
                rate: parseFloat(rate),
                total,
                notes
            }])
            .select(`
        *,
        party:parties(id, name, address),
        item:items(id, name, default_unit)
      `)
            .single();

        if (error) throw error;

        // Update stock
        await updateStock(item_id);

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating purchase:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update purchase
router.put('/:id', async (req, res) => {
    try {
        const { date, party_id, item_id, quantity, unit, rate, notes } = req.body;

        // Get old purchase to update old item's stock
        const { data: oldPurchase } = await supabase
            .from('purchases')
            .select('item_id')
            .eq('id', req.params.id)
            .single();

        const total = parseFloat(quantity) * parseFloat(rate);

        const { data, error } = await supabase
            .from('purchases')
            .update({
                date,
                party_id,
                item_id,
                quantity: parseFloat(quantity),
                unit,
                rate: parseFloat(rate),
                total,
                notes
            })
            .eq('id', req.params.id)
            .select(`
        *,
        party:parties(id, name, address),
        item:items(id, name, default_unit)
      `)
            .single();

        if (error) throw error;

        // Update stock for both old and new items
        if (oldPurchase && oldPurchase.item_id !== item_id) {
            await updateStock(oldPurchase.item_id);
        }
        await updateStock(item_id);

        res.json(data);
    } catch (error) {
        console.error('Error updating purchase:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete purchase
router.delete('/:id', async (req, res) => {
    try {
        // Get purchase to update stock
        const { data: purchase } = await supabase
            .from('purchases')
            .select('item_id')
            .eq('id', req.params.id)
            .single();

        const { error } = await supabase
            .from('purchases')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        // Update stock
        if (purchase) {
            await updateStock(purchase.item_id);
        }

        res.json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        console.error('Error deleting purchase:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
