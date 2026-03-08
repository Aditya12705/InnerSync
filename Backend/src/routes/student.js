import { Router } from 'express';
import mongoose from 'mongoose';
import { protectRoute } from '../middleware/protectRoute.js';
import Assessment from '../models/Assessment.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const router = Router();

// GET /api/student/dashboard-summary
// Fetches the latest assessment and next appointment for the logged-in student.
router.get('/dashboard-summary', protectRoute, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ 
        message: 'User ID is missing',
        error: 'No user ID provided in the authentication token' 
      });
    }
    
    let studentId;
    let isDemoUser = req.user.id === 'student-demo';
    
    try {
      // For demo user, we'll handle it specially
      if (isDemoUser) {
        // Return demo data
        return res.json({
          studentName: 'Demo Student',
          lastAssessment: {
            _id: 'demo-assessment-1',
            studentId: 'student-demo',
            totalScore: 15, // Example score
            completedAt: new Date(),
            responses: [],
            severity: 'mild'
          },
          nextAppointment: null // No appointments for demo user
        });
      }
      
      // For regular users, expect a valid MongoDB ObjectId
      studentId = new mongoose.Types.ObjectId(req.user.id);
    } catch (error) {
      console.error('Invalid student ID format:', req.user.id);
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'User ID must be a valid MongoDB ObjectId or demo user ID',
        receivedId: req.user.id
      });
    }

    try {
      // Fetch the most recent assessment for the student
      const lastAssessment = await Assessment.findOne({ studentId })
        .sort({ completedAt: -1 })
        .limit(1);

      // Fetch the next upcoming appointment
      const nextAppointment = await Appointment.findOne({
        studentId,
        startsAt: { $gte: new Date() },
        status: 'booked',
      })
        .sort({ startsAt: 1 })
        .populate('counselorId', 'name');

      // Fetch student's name
      const student = await User.findById(studentId).select('name');

      return res.json({
        studentName: student ? student.name : 'Student',
        lastAssessment: lastAssessment || null,
        nextAppointment: nextAppointment || null,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        message: 'Error fetching dashboard data',
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error('Unexpected error in dashboard summary:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch dashboard summary', 
      error: error.message 
    });
  }
});

export default router;