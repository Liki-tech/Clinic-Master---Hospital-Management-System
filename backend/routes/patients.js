import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-soft-grass-a57hhham-pooler.us-east-2.aws.neon.tech',
  database: 'neondb',
  password: 'npg_PzVyr0kJK9Mg',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});




// Get all patients for current clinic
router.get('/', async (req, res) => {
  try {
    const clinicId = req.user.clinicId; // Assuming clinic ID is in the user object
    const result = await pool.query('SELECT * FROM patients WHERE clinic_id = $1', [clinicId]);
    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single patient by ID for current clinic
router.get('/:id', async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1 AND clinic_id = $2', [id, clinicId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new patient
router.post('/', async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { name, age, gender, phone, email, address } = req.body;
    const result = await pool.query(
      `INSERT INTO patients 
      (name, age, gender, phone, email, address, clinic_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, age, gender, phone, email, address, clinicId]

    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a patient for current clinic
router.put('/:id', async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const { name, age, gender, phone, email, address } = req.body;
    const result = await pool.query(
      `UPDATE patients SET 
      name = $1, age = $2, gender = $3, phone = $4, email = $5, address = $6 
      WHERE id = $7 AND clinic_id = $8 RETURNING *`,
      [name, age, gender, phone, email, address, id, clinicId]

    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // First delete associated appointments
    await client.query('DELETE FROM appointments WHERE patient_id = $1', [id]);
    
    // Then delete the patient
    const result = await client.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Patient and associated appointments deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  } finally {
    client.release();
  }
});


export default router;
