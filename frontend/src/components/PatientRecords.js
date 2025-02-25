import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Box,
  Chip
} from '@mui/material';
import { WhatsApp, Edit, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';

import { TablePagination } from '@mui/material';



function PatientRecords() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [expandedRows, setExpandedRows] = useState([]);


  const [currentPatient, setCurrentPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    medical_history: '',
    remarks: ''
  });


  useEffect(() => {
    // Fetch patients from API
    fetchPatients();
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error('Invalid data format: expected array');
        setPatients([]);
        enqueueSnackbar('Invalid data format received from server', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      enqueueSnackbar('Failed to fetch patients: ' + error.message, { variant: 'error' });
    }
  };



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleOpenDialog = (patient = null) => {
    setCurrentPatient(patient || {
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      medical_history: '',
      remarks: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    setCurrentPatient({
      ...currentPatient,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = currentPatient.id ? 'PUT' : 'POST';
      const url = currentPatient.id ? `/api/patients/${currentPatient.id}` : '/api/patients';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPatient),
      });

      if (response.ok) {
        fetchPatients();
        handleCloseDialog();
        enqueueSnackbar(`Patient ${currentPatient.id ? 'updated' : 'added'} successfully!`, { variant: 'success' });
      } else {
        throw new Error('Failed to save patient');
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      enqueueSnackbar('Failed to save patient: ' + error.message, { variant: 'error' });
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPatients();
        enqueueSnackbar('Patient deleted successfully!', { variant: 'success' });
      } else {
        throw new Error('Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      enqueueSnackbar('Failed to delete patient: ' + error.message, { variant: 'error' });
    }
  };



  return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Typography variant="h4" component="h1" gutterBottom style={{ color: '#1976d2', marginBottom: '30px' }}>
          Patient Management
        </Typography>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <TextField
            label="Search Patients"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            style={{ flex: 1, backgroundColor: 'white' }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handleOpenDialog()}
            style={{ height: '40px' }}
          >
            Add New Patient
          </Button>
        </div>


      <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Age</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => {
              const isExpanded = expandedRows.includes(patient.id);
              return (
                <React.Fragment key={patient.id}>
                  <TableRow 
                    hover 
                    style={{ cursor: 'pointer', backgroundColor: isExpanded ? '#f0f0f0' : 'white' }}
                    onClick={() => setExpandedRows(prev => 
                      isExpanded ? prev.filter(id => id !== patient.id) : [...prev, patient.id]
                    )}
                  >
                    <TableCell>{patient.name}</TableCell>


                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={(e) => { e.stopPropagation(); handleWhatsApp(patient.phone); }}
                      >
                        <WhatsApp />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={(e) => { e.stopPropagation(); handleOpenDialog(patient); }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => { e.stopPropagation(); handleDelete(patient.id); }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                          <Typography variant="h6" gutterBottom>
                            Patient Details
                          </Typography>
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Box>
                              <Typography variant="subtitle1">Address:</Typography>
                              <Typography>{patient.address}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1">Medical History:</Typography>
                              <Typography>{patient.medical_history}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1">Remarks:</Typography>
                              <Typography>{patient.remarks}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>


              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 30, 50, 100]}
        component="div"
        count={filteredPatients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />



      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentPatient.id ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={currentPatient.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Age"
              name="age"
              type="number"
              value={currentPatient.age}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Gender"
              name="gender"
              value={currentPatient.gender}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={currentPatient.phone}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={currentPatient.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={currentPatient.address}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Medical History"
              name="medical_history"
              value={currentPatient.medical_history}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Remarks"
              name="remarks"
              value={currentPatient.remarks}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export default PatientRecords;
