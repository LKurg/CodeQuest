const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./connection');
const userRoutes = require('./routes/users'); // Import user routes

const courseRoutes = require('./routes/courses');
const lipaNaMpesaRoutes=require('./routes/lipanampesa')
const quizRoutes = require('./routes/quiz');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Example route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ message: 'Server is healthy and connected to MongoDB' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api', lipaNaMpesaRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//app.use('/api/quests', questRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(err.status || 500).json({ error: err.message || 'An unexpected error occurred' });
});

// 404 Error handler for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
