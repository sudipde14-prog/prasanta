const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Check if PIN is set
router.get('/pin', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'app_pin')
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.json({
            pin_set: !!data?.value,
        });
    } catch (error) {
        console.error('Error checking PIN:', error);
        res.status(500).json({ error: error.message });
    }
});

// Set/Update PIN
router.post('/pin', async (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            return res.status(400).json({ error: 'PIN must be 4 digits' });
        }

        const { error } = await supabase
            .from('settings')
            .upsert({ key: 'app_pin', value: pin });

        if (error) throw error;

        res.json({ message: 'PIN set successfully' });
    } catch (error) {
        console.error('Error setting PIN:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
    try {
        const { pin } = req.body;

        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'app_pin')
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!data?.value) {
            return res.json({ valid: true, message: 'No PIN set' });
        }

        const valid = data.value === pin;
        res.json({ valid });
    } catch (error) {
        console.error('Error verifying PIN:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete PIN
router.delete('/pin', async (req, res) => {
    try {
        const { error } = await supabase
            .from('settings')
            .delete()
            .eq('key', 'app_pin');

        if (error) throw error;

        res.json({ message: 'PIN removed successfully' });
    } catch (error) {
        console.error('Error removing PIN:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
