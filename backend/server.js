require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const partiesRoutes = require('./src/routes/parties');
const itemsRoutes = require('./src/routes/items');
const purchasesRoutes = require('./src/routes/purchases');
const stockRoutes = require('./src/routes/stock');
const ledgerRoutes = require('./src/routes/ledger');
const reportsRoutes = require('./src/routes/reports');
const settingsRoutes = require('./src/routes/settings');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/parties', partiesRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong', 
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
