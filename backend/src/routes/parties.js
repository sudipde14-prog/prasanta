const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Get all parties
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('parties')
            .select('*')
            .order('name');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching parties:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single party
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('parties')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching party:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create party
router.post('/', async (req, res) => {
    try {
        const { name, type, address, phone, notes } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const { data, error } = await supabase
            .from('parties')
            .insert([{ name, type: type || 'supplier', address, phone, notes }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating party:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update party
router.put('/:id', async (req, res) => {
    try {
        const { name, type, address, phone, notes } = req.body;

        const { data, error } = await supabase
            .from('parties')
            .update({ name, type, address, phone, notes })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating party:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete party
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('parties')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Party deleted successfully' });
    } catch (error) {
        console.error('Error deleting party:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
