import pkg from 'pg';
const { Pool } = pkg;




const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-soft-grass-a57hhham-pooler.us-east-2.aws.neon.tech',
  database: 'neondb',
  password: 'npg_PzVyr0kJK9Mg',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
const result = await pool.query('SELECT * FROM appointments WHERE clinic_id = $1', [req.user.clinicId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, start_time, end_time, status } = req.body;
    const result = await pool.query(
      `INSERT INTO appointments 
      (patient_id, doctor_id, start_time, end_time, status) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, doctor_id, start_time, end_time, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific appointment
export const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
const result = await pool.query('SELECT * FROM appointments WHERE id = $1 AND clinic_id = $2', [id, req.user.clinicId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, start_time, end_time, status } = req.body;
const result = await pool.query(
      `UPDATE appointments SET 
      patient_id = $1, doctor_id = $2, start_time = $3, end_time = $4, status = $5 
      WHERE id = $6 AND clinic_id = $7 RETURNING *`,
      [patient_id, doctor_id, start_time, end_time, status, id, req.user.clinicId]

    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
const result = await pool.query('DELETE FROM appointments WHERE id = $1 AND clinic_id = $2 RETURNING *', [id, req.user.clinicId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
