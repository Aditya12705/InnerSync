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
import studentRoutes from './routes/student.js'; // Import the new student routes
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

// CORS configuration for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With']
}));

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'InnerSync API' }));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/student', studentRoutes); // Add the new student routes

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// For Vercel Serverless: Connect to DB once
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  if (!MONGO_URI) {
    console.error('CRITICAL: MONGO_URI is not defined in environment variables!');
    throw new Error('Database configuration missing (MONGO_URI)');
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    // Log a masked version of the URI for debugging
    const maskedURI = MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`Using URI: ${maskedURI.substring(0, 30)}...`);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error details:', err.message);
    throw err;
  }
};

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
  });
}

// Ensure DB connects middleware-style for Vercel
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

export default app;