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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hopeline';

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });