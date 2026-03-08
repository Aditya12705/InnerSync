import { Router } from 'express'
import mongoose from 'mongoose'
import Appointment from '../models/Appointment.js'
import User from '../models/User.js'
import { protectRoute, isCounselor } from '../middleware/protectRoute.js'

const router = Router()

// Book a new appointment
router.post('/book', protectRoute, async (req, res) => {
  try {
    let { studentId, counselorId, startsAt } = req.body
    
    // Validate input
    if (!studentId || !counselorId || !startsAt) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    // Ensure IDs are strings
    studentId = String(studentId).trim();
    counselorId = String(counselorId).trim();
    
    // Pad short IDs with leading zeros to make them valid ObjectId
    const padId = (id) => {
      if (id.length < 24) {
        return id.padStart(24, '0');
      }
      return id;
    };
    
    console.log('Creating appointment with:', { studentId, counselorId, startsAt });
    
    // Create a new appointment
    const appt = await Appointment.create({
      studentId: new mongoose.Types.ObjectId(padId(studentId)),
      counselorId: new mongoose.Types.ObjectId(padId(counselorId)),
      startsAt: new Date(startsAt),
      status: 'booked'
    })
    
    // Populate the appointment with user details
    const populatedAppt = await Appointment.findById(appt._id)
      .populate('studentId', 'name email')
      .populate('counselorId', 'name email')
      .exec()
    
    res.status(201).json(populatedAppt)
  } catch (error) {
    console.error('Error creating appointment:', error)
    res.status(500).json({ message: 'Error creating appointment', error: error.message })
  }
})

// Get appointments for a specific counselor
router.get('/counselor/:counselorId', protectRoute, isCounselor, async (req, res) => {
  try {
    let { counselorId } = req.params;
    
    // Handle demo counselor
    if (counselorId === 'counselor-demo') {
      // Return mock appointments for demo
      const mockAppointments = [
        {
          _id: 'demo-appt-1',
          student: {
            _id: 'student-demo',
            name: 'Demo Student',
            email: 'student@university.edu'
          },
          counselorId: 'counselor-demo',
          startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          status: 'booked',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'demo-appt-2',
          student: {
            _id: 'student-demo-2',
            name: 'Jane Smith',
            email: 'jane@university.edu'
          },
          counselorId: 'counselor-demo',
          startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          status: 'booked',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      return res.json(mockAppointments);
    }
    
    // For non-demo counselors, ensure ID is a string and pad if necessary
    counselorId = String(counselorId).trim();
    if (counselorId.length < 24) {
      counselorId = counselorId.padStart(24, '0');
    }
    
    console.log('Fetching appointments for counselor ID:', counselorId);
    
    // Validate counselorId
    if (!mongoose.Types.ObjectId.isValid(counselorId)) {
      return res.status(400).json({ message: 'Invalid counselor ID format' });
    }
    
    const appointments = await Appointment.find({
      counselorId: new mongoose.Types.ObjectId(counselorId),
      status: 'booked',
      startsAt: { $gte: new Date() } // Only show future appointments
    })
    .sort({ startsAt: 1 }) // Sort by appointment time
    .populate('studentId', 'name email')
    
    // Format the response
    const formattedAppointments = appointments.map(appt => ({
      _id: appt._id,
      student: appt.studentId ? {
        _id: appt.studentId._id,
        name: appt.studentId.name,
        email: appt.studentId.email
      } : null,
      counselorId: appt.counselorId,
      startsAt: appt.startsAt,
      status: appt.status,
      createdAt: appt.createdAt,
      updatedAt: appt.updatedAt
    }))
    
    res.json(formattedAppointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    res.status(500).json({ 
      message: 'Error fetching appointments',
      error: error.message 
    })
  }
})

export default router


