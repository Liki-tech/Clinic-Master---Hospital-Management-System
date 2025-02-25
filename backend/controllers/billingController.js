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

// Get all bills
export const getAllBills = async (req, res) => {
  try {
const result = await pool.query('SELECT * FROM payments WHERE clinic_id = $1', [req.user.clinicId]);


    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bills:', {
      message: error.message,
      stack: error.stack,
      query: 'SELECT * FROM bills'
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};





// Create a new bill
export const createBill = async (req, res) => {
  try {
    const { patient_id, services, total, gst, discount, final_amount } = req.body;
    const result = await pool.query(
      `INSERT INTO payments 

      (patient_id, services, total, gst, discount, final_amount) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient_id, services, total, gst, discount, final_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific bill
export const getBill = async (req, res) => {
  try {
    const { id } = req.params;
const result = await pool.query('SELECT * FROM payments WHERE id = $1 AND clinic_id = $2', [id, req.user.clinicId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a bill
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { services, total, gst, discount, final_amount } = req.body;
const result = await pool.query(
      `UPDATE payments SET 
      services = $1, total = $2, gst = $3, discount = $4, final_amount = $5 
      WHERE id = $6 AND clinic_id = $7 RETURNING *`,
      [services, total, gst, discount, final_amount, id, req.user.clinicId]

    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a bill
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
const result = await pool.query('DELETE FROM payments WHERE id = $1 AND clinic_id = $2 RETURNING *', [id, req.user.clinicId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
