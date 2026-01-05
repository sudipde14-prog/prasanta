const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Get ledger for a party
router.get('/:partyId', async (req, res) => {
    try {
        const { start_date, end_date, item_id } = req.query;

        let query = supabase
            .from('purchases')
            .select(`
        *,
        item:items(id, name, default_unit)
      `)
            .eq('party_id', req.params.partyId)
            .order('date', { ascending: false });

        if (start_date) query = query.gte('date', start_date);
        if (end_date) query = query.lte('date', end_date);
        if (item_id) query = query.eq('item_id', item_id);

        const { data: purchases, error } = await query;

        if (error) throw error;

        // Get party info
        const { data: party } = await supabase
            .from('parties')
            .select('*')
            .eq('id', req.params.partyId)
            .single();

        // Calculate summary
        const summary = {
            total_entries: purchases.length,
            total_quantity: purchases.reduce((sum, p) => sum + parseFloat(p.quantity || 0), 0),
            total_amount: purchases.reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
        };

        res.json({
            party,
            purchases,
            summary
        });
    } catch (error) {
        console.error('Error fetching ledger:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
