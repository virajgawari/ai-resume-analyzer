const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Import routes
const resumeRoutes = require('./routes/resume');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-analyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/auth', authRoutes);

// Health check (useful to verify DB connectivity on Vercel)
app.get('/api/health', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    let ping = null;
    if (state === 1 && mongoose.connection.db) {
      ping = await mongoose.connection.db.admin().ping();
    }
    res.json({ status: 'ok', dbState: state, ping });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err?.message || 'Health check failed' });
  }
});

// Serve static files from React app when a build exists (production or packaged run)
(() => {
  const clientBuildPath = path.join(__dirname, '../client/build');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// In Vercel, we export the app as a serverless function handler.
// Locally, we still listen on a port for development.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
