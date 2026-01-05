const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Get all stock summaries
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stock')
            .select(`
        item_id,
        total_quantity,
        updated_at,
        item:items(id, name, default_unit)
      `)
            .order('item(name)');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ error: error.message });
    }
});

// Manual stock adjustment
router.put('/:itemId', async (req, res) => {
    try {
        const { total_quantity, reason } = req.body;

        const { data, error } = await supabase
            .from('stock')
            .upsert({
                item_id: req.params.itemId,
                total_quantity: parseFloat(total_quantity),
                updated_at: new Date().toISOString()
            })
            .select(`
        item_id,
        total_quantity,
        updated_at,
        item:items(id, name, default_unit)
      `)
            .single();

        if (error) throw error;

        console.log(`Stock adjusted for item ${req.params.itemId}: ${total_quantity}. Reason: ${reason || 'Manual adjustment'}`);

        res.json(data);
    } catch (error) {
        console.error('Error adjusting stock:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
