import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import pkg from 'pg';
const { Pool } = pkg;
console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging line

// Import routes
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import billingRoutes from './routes/billing.js';
import appointmentRoutes from './routes/appointments.js';
import clinicRoutes from './routes/clinic.js';


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;


// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify route imports
console.log('Auth routes:', authRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinic', clinicRoutes);



// Test auth route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});


// Test route
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('Clinic Management System Backend is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
