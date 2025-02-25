import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

import bcrypt from 'bcrypt';
import User from '../models/User.js';

// Password hashing salt rounds
const SALT_ROUNDS = 10;






// Login route
router.post('/login', async (req, res) => {
  const { email, password, clinicId } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    if (typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid password format' });
    }
    const validPassword = await bcrypt.compare(password, user.password);





    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
      clinicId: user.clinicId

      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email
      },
      message: 'Login successful'

    });


  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
