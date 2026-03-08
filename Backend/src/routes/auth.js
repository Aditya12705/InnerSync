import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    // Prioritize finding a user in the database
    const query = email ? { email } : { username };
    const user = await User.findOne(query);

    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        // Ensure the user ID is a string in the JWT payload
        const userId = user._id.toString();
        const token = jwt.sign(
          { id: userId, role: user.role }, 
          process.env.JWT_SECRET || 'dev_secret', 
          { expiresIn: '1d' }
        );
        const userPayload = { 
          id: userId, 
          role: user.role, 
          name: user.name, 
          email: user.email 
        };
        return res.json({ token, user: userPayload });
      }
    }

    // Handle demo student login
    if ((email === 'student@university.edu' || username === 'demo_student') && password === 'demo123') {
      const demoUser = {
        _id: 'student-demo',
        role: 'student',
        name: 'Demo Student',
        email: 'student@university.edu'
      };
      
      const token = jwt.sign(
        { id: demoUser._id, role: demoUser.role },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '1d' }
      );
      
      return res.json({
        token,
        user: {
          id: demoUser._id,
          role: demoUser.role,
          name: demoUser.name,
          email: demoUser.email
        }
      });
    }
    
    // Handle demo counselor login
    if (username === 'rajat' && password === 'rajat123') {
      const demoCounselor = {
        _id: 'counselor-demo',
        role: 'counselor',
        name: 'Dr. Rajat Sharma',
        email: 'rajat@counselor.edu'
      };
      
      const token = jwt.sign(
        { id: demoCounselor._id, role: demoCounselor.role },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '1d' }
      );
      
      return res.json({
        token,
        user: {
          id: demoCounselor._id,
          role: demoCounselor.role,
          name: demoCounselor.name,
          email: demoCounselor.email
        }
      });
    }

    console.log('No matching credentials found for:', { email, username });
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body
    const user = await User.create({ name, email, username, password, role })
    res.status(201).json({ id: user._id })
  } catch(error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
})

export default router