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
  ssl: { 
    rejectUnauthorized: false
  }
});

// Get clinic info
router.get('/info', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clinic_settings LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching clinic info:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update clinic info
router.post('/info', async (req, res) => {
  const { name, address, phone, email, gst_number } = req.body;
  try {
    await pool.query(`
      INSERT INTO clinic_settings (name, address, phone, email, gst_number)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        gst_number = EXCLUDED.gst_number
    `, [name, address, phone, email, gst_number]);
    res.json({ message: 'Clinic info updated successfully' });
  } catch (err) {
    console.error('Error updating clinic info:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add/update department
router.post('/departments', async (req, res) => {
  const { id, name } = req.body;
  try {
    if (id) {
      await pool.query('UPDATE departments SET name = $1 WHERE id = $2', [name, id]);
    } else {
      await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    }
    res.json({ message: 'Department saved successfully' });
  } catch (err) {
    console.error('Error saving department:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete department
router.delete('/departments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM departments WHERE id = $1', [req.params.id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add/update doctor
router.post('/doctors', async (req, res) => {
  const { id, name, specialization, department_id } = req.body;
  try {
    if (id) {
      await pool.query(
        'UPDATE doctors SET name = $1, specialization = $2, department_id = $3 WHERE id = $4',
        [name, specialization, department_id, id]
      );
    } else {
      await pool.query(
        'INSERT INTO doctors (name, specialization, department_id) VALUES ($1, $2, $3)',
        [name, specialization, department_id]
      );
    }
    res.json({ message: 'Doctor saved successfully' });
  } catch (err) {
    console.error('Error saving doctor:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM doctors WHERE id = $1', [req.params.id]);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all services
router.get('/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add/update service
router.post('/services', async (req, res) => {
  const { id, name, price, department_id } = req.body;
  try {
    if (id) {
      await pool.query(
        'UPDATE services SET name = $1, price = $2, department_id = $3 WHERE id = $4',
        [name, price, department_id, id]
      );
    } else {
      await pool.query(
        'INSERT INTO services (name, price, department_id) VALUES ($1, $2, $3)',
        [name, price, department_id]
      );
    }
    res.json({ message: 'Service saved successfully' });
  } catch (err) {
    console.error('Error saving service:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete service
router.delete('/services/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
