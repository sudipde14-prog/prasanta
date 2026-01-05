const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Get all items
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('name');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single item
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create item
router.post('/', async (req, res) => {
    try {
        const { name, default_unit, notes } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Create item
        const { data: item, error: itemError } = await supabase
            .from('items')
            .insert([{ name, default_unit: default_unit || 'KG', notes }])
            .select()
            .single();

        if (itemError) throw itemError;

        // Initialize stock for this item
        const { error: stockError } = await supabase
            .from('stock')
            .insert([{ item_id: item.id, total_quantity: 0 }]);

        if (stockError) console.error('Error initializing stock:', stockError);

        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update item
router.put('/:id', async (req, res) => {
    try {
        const { name, default_unit, notes } = req.body;

        const { data, error } = await supabase
            .from('items')
            .update({ name, default_unit, notes })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete item
router.delete('/:id', async (req, res) => {
    try {
        // Delete stock record first
        await supabase
            .from('stock')
            .delete()
            .eq('item_id', req.params.id);

        // Delete item
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
