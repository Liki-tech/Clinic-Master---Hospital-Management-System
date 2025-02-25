import express from 'express';
import { 
  createBill,
  getBill,
  updateBill,
  deleteBill,
  getAllBills
} from '../controllers/billingController.js';

const router = express.Router();

// Get all bills
router.get('/', getAllBills);

// Create a new bill

router.post('/', createBill);

// Get a specific bill
router.get('/:id', getBill);

// Update a bill
router.put('/:id', updateBill);

// Delete a bill
router.delete('/:id', deleteBill);

export default router;
