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
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://prasanta.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    // Allow all Vercel preview URLs
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }

    // Allow localhost for development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    // Check explicit allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn('CORS blocked origin:', origin);
    callback(new Error('CORS blocked'));
  },
  credentials: true,
}));
app.use(express.json());

// Health check (Keep-Alive)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

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
