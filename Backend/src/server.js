import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import feedbackRoutes from './routes/feedback.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';
import studentRoutes from './routes/student.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Disable buffering so we get immediate errors if not connected
mongoose.set('bufferCommands', false);

// For Vercel Serverless: Connect to DB once
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  if (!MONGO_URI) {
    throw new Error('Database configuration missing (MONGO_URI is undefined)');
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    isConnected = false;
    throw err;
  }
};

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With']
}));

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// 1. DATABASE CONNECT MIDDLEWARE (MUST BE BEFORE ROUTES)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({
      message: 'Database connection failed',
      details: err.message
    });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok', service: 'InnerSync API' }));

// 2. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/student', studentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// If not on Vercel, start the server normally
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  }).catch(err => {
    console.error('Initial DB connection failed:', err);
  });
}

export default app;