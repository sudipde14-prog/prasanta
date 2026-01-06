const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
} else {
    console.warn('Warning: Supabase credentials not configured. Database features will not work.');
    // Create a mock client that returns errors
    supabase = {
        from: () => ({
            select: () => Promise.reject(new Error('Supabase not configured')),
            insert: () => Promise.reject(new Error('Supabase not configured')),
            update: () => Promise.reject(new Error('Supabase not configured')),
            delete: () => Promise.reject(new Error('Supabase not configured')),
            upsert: () => Promise.reject(new Error('Supabase not configured')),
            eq: () => ({ single: () => Promise.reject(new Error('Supabase not configured')) }),
        }),
    };
}

module.exports = supabase;
