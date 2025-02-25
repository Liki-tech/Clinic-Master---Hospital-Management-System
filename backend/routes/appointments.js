import express from 'express';
import { 
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getAllAppointments
} from '../controllers/appointmentsController.js';


const router = express.Router();

router.get('/', (req, res, next) => {
  req.user.clinicId ? getAllAppointments(req, res, next) : res.status(403).json({ error: 'Access denied' });
});


router.post('/', (req, res, next) => {
  req.user.clinicId ? createAppointment(req, res, next) : res.status(403).json({ error: 'Access denied' });
});


router.get('/:id', (req, res, next) => {
  req.user.clinicId ? getAppointment(req, res, next) : res.status(403).json({ error: 'Access denied' });
});


router.put('/:id', (req, res, next) => {
  req.user.clinicId ? updateAppointment(req, res, next) : res.status(403).json({ error: 'Access denied' });
});


router.delete('/:id', (req, res, next) => {
  req.user.clinicId ? deleteAppointment(req, res, next) : res.status(403).json({ error: 'Access denied' });
});


router.patch('/:id/status', (req, res, next) => {
  req.user.clinicId ? updateAppointmentStatus(req, res, next) : res.status(403).json({ error: 'Access denied' });
});


export default router;
