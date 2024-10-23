const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const morgan = require('morgan');
const helmet = require('helmet');
const guestChannelRoutes = require('./routes/guestChannelRoutes');
const channelRouter = require('./routes/channelRouter');
const userRouter = require('./routes/userRouter');
const messageRouter = require('./routes/messageRouter');

// Load environment variables from .env file
dotenv.config();

// Check if PORT is defined in .env
const PORT = process.env.PORT || 5000;
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // Your frontend URL
  'http://localhost:5000', // If your backend needs to accept requests from itself
  'https://file-chat-server.vercel.app/' // Your production URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.trim())) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());

// Connect to MongoDB
(async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
})();

// Mount routes
app.use('/api/guest', guestChannelRoutes);
app.use('/api/users', userRouter);
app.use('/api/channels', channelRouter);
app.use('/api/messages', messageRouter);

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `The route ${req.originalUrl} does not exist` });
});

// Global error handling middleware
app.use((err, req, res) => {
  console.error('Global error handler:', err.stack || err);
  res.status(err.status || 500).json({ error: 'Internal Server Error', message: err.message || 'Something went wrong' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
