import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { WhatsApp, PictureAsPdf } from '@mui/icons-material';

function Billing() {
  const { patientId } = useParams();

  useEffect(() => {
    if (patientId) {
      // Fetch patient details when component mounts
      const fetchPatient = async () => {
        try {
          const response = await fetch(`/api/patients/${patientId}`);
          if (response.ok) {
            const patient = await response.json();
            setBill(prev => ({
              ...prev,
              patientName: patient.name,
              phone: patient.phone
            }));
          }
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      };
      fetchPatient();
    }
  }, [patientId]);

  const [bill, setBill] = useState({
    patientName: '',
    phone: '',
    services: [],
    total: 0,
    gst: 0,
    discount: 0,
    finalAmount: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [snackbar, setSnackbar] = useState({

    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setBill(prev => ({ ...prev, [name]: value }));

    if (name === 'phone' && value.length >= 10) {
      try {
const response = await fetch(`/api/patients?phone=${value}`);


        if (response.ok) {
          const patient = await response.json();
          if (patient) {
            setBill(prev => ({
              ...prev,
              patientName: patient.name
            }));
          } else {
            // If patient doesn't exist, prompt to create new
            setBill(prev => ({
              ...prev,
              patientName: ''
            }));
            const createPatient = window.confirm('Patient not found. Create new patient?');
            if (createPatient) {
              setOpenDialog(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    }
  };


  const handleAddService = () => {
    setBill(prev => ({
      ...prev,
      services: [...prev.services, { name: '', price: 0 }]
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...bill.services];
    newServices[index][field] = value;
    setBill(prev => ({
      ...prev,
      services: newServices,
      total: newServices.reduce((sum, service) => sum + Number(service.price), 0)
    }));
  };

  const calculateFinalAmount = () => {
    const gstAmount = (bill.total * bill.gst) / 100;
    const discountAmount = (bill.total * bill.discount) / 100;
    return bill.total + gstAmount - discountAmount;
  };

  const handleWhatsAppShare = () => {
    const phone = bill.phone.replace(/[^0-9]/g, '');
    if (!phone || phone.length < 10) {
      setSnackbar({
        open: true,
        message: 'Invalid phone number',
        severity: 'error'
      });
      return;
    }

    const message = `Your bill details:\n\n` +
      `Patient: ${bill.patientName}\n` +
      `Total: ₹${bill.total.toFixed(2)}\n` +
      `GST: ${bill.gst}%\n` +
      `Discount: ${bill.discount}%\n` +
      `Final Amount: ₹${calculateFinalAmount().toFixed(2)}\n\n` +
      `Thank you for choosing our clinic!`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSnackbar({
      open: true,
      message: 'Bill shared via WhatsApp',
      severity: 'success'
    });
  };

  const handleGeneratePDF = () => {
    // PDF generation logic here
    setSnackbar({
      open: true,
      message: 'PDF generated successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Billing Management
        </Typography>

        {/* Patient Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Patient Name"
              name="patientName"
              value={bill.patientName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={bill.phone}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </Box>

        {/* Services */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Services
          </Typography>
          {bill.services.map((service, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Service Name"
                value={service.name}
                onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={service.price}
                onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                fullWidth
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddService}>
            Add Service
          </Button>
        </Box>

        {/* Taxes and Discounts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Taxes & Discounts
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="GST (%)"
              name="gst"
              type="number"
              value={bill.gst}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Discount (%)"
              name="discount"
              type="number"
              value={bill.discount}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </Box>

        {/* Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">₹{bill.total.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GST ({bill.gst}%)</TableCell>
                  <TableCell align="right">₹{((bill.total * bill.gst) / 100).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Discount ({bill.discount}%)</TableCell>
                  <TableCell align="right">₹{((bill.total * bill.discount) / 100).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Final Amount</strong></TableCell>
                  <TableCell align="right">
                    <strong>₹{calculateFinalAmount().toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsAppShare}
          >
            Share via WhatsApp
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={handleGeneratePDF}
          >
            Generate PDF
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* New Patient Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Patient</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={newPatient.name}
              onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={newPatient.phone}
              onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              fullWidth
              value={newPatient.email}
              onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              fullWidth
              value={newPatient.address}
              onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              try {
const response = await fetch('/api/patients', {


                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newPatient),
                });

                if (response.ok) {
                  setBill(prev => ({
                    ...prev,
                    patientName: newPatient.name
                  }));
                  setOpenDialog(false);
                  setSnackbar({
                    open: true,
                    message: 'Patient created successfully',
                    severity: 'success'
                  });
                }
              } catch (error) {
                console.error('Error creating patient:', error);
                setSnackbar({
                  open: true,
                  message: 'Error creating patient',
                  severity: 'error'
                });
              }
            }}
          >
            Create Patient
          </Button>
        </DialogActions>
      </Dialog>
    </Container>

  );
}

export default Billing;
