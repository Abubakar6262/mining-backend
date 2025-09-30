const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db.config');

// Initialize Express app
const app = express();


// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Parse incoming JSON requests
app.use(express.json());

    
// Import routes
const authRoutes = require('./routes/authRoutes');
const mineRoutes = require('./routes/mineRoute');

// Default test route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/mine', mineRoutes);

// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});