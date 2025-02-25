import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

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
  Avatar
} from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import ConfirmationDialog from './ConfirmationDialog';


function ClinicSettings() {
  const { enqueueSnackbar } = useSnackbar();
  
  const clinicValidationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number is not valid')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    gst_number: Yup.string()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number')
      .required('Required')
  });

  const [clinicInfo, setClinicInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gst_number: '',
    logo: null,
    logoFile: null
  });



  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [currentItem, setCurrentItem] = useState(null);
  const [dialogType, setDialogType] = useState('');

  useEffect(() => {
    fetchClinicData();
  }, []);

  const fetchClinicData = async () => {
    try {
      const [infoRes, doctorsRes, deptRes, servicesRes] = await Promise.all([
        fetch('/api/clinic/info'),
        fetch('/api/clinic/doctors'),
        fetch('/api/clinic/departments'),
        fetch('/api/clinic/services')

      ]);

      setClinicInfo(await infoRes.json());
      setDoctors(await doctorsRes.json());
      setDepartments(await deptRes.json());
      setServices(await servicesRes.json());
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setClinicInfo(prev => ({ 
          ...prev, 
          logo: reader.result,
          logoFile: file 
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setCurrentItem(item || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const handleSave = async (type, data) => {
    try {
      const url = `/api/clinic/${type}`;

      const method = data.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchClinicData();
        handleCloseDialog();
        enqueueSnackbar(`${type.slice(0, -1)} saved successfully!`, { 
          variant: 'success',
          autoHideDuration: 3000
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      enqueueSnackbar(`Failed to save ${type}: ${error.message}`, { 
        variant: 'error',
        autoHideDuration: 5000
      });
    }
  };


  const handleDelete = (type, id) => {
    setConfirmDialog({
      open: true,
      title: `Delete ${type.slice(0, -1)}`,
      message: `Are you sure you want to delete this ${type.slice(0, -1)}?`,
      onConfirm: async () => {
        try {
      const response = await fetch(`/api/clinic/${type}/${id}`, {

            method: 'DELETE',
          });

          if (response.ok) {
            fetchClinicData();
            enqueueSnackbar(`${type.slice(0, -1)} deleted successfully!`, { 
              variant: 'success',
              autoHideDuration: 3000
            });
          } else {
            throw new Error('Failed to delete');
          }
        } catch (error) {
          console.error(`Error deleting ${type}:`, error);
          enqueueSnackbar(`Failed to delete ${type}: ${error.message}`, { 
            variant: 'error',
            autoHideDuration: 5000
          });
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.price.toString().includes(searchTerm)
  );



  const handleLogout = () => {
    // Implement logout logic
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Clinic Settings
        </Typography>

        {/* Clinic Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Clinic Information
          </Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={clinicInfo.logo}
                sx={{ width: 100, height: 100 }}
              />
              <Button variant="contained" component="label">
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
            </Box>
            <TextField
              label="Clinic Name"
              name="name"
              value={clinicInfo.name || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Address"
              name="address"
              value={clinicInfo.address}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Phone"
              name="phone"
              value={clinicInfo.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={clinicInfo.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="GST Number"
              name="gst_number"
              value={clinicInfo.gst_number}
              onChange={handleInputChange}
              fullWidth
            />
            <Button variant="contained" onClick={() => handleSave('clinic/info', clinicInfo)}>
              Save Clinic Info
            </Button>
          </Box>
        </Box>

        {/* Departments */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Departments
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />
              }}
              sx={{ width: 300 }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog('departments', dept)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete('departments', dept.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog('departments')}
            sx={{ mt: 2 }}
          >
            Add Department
          </Button>
        </Box>

        {/* Doctors */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doctors
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />
              }}
              sx={{ width: 300 }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{departments.find(d => d.id === doctor.department_id)?.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog('doctors', doctor)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete('doctors', doctor.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog('doctors')}
            sx={{ mt: 2 }}
          >
            Add Doctor
          </Button>
        </Box>

        {/* Services */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />
              }}
              sx={{ width: 300 }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{departments.find(d => d.id === service.department_id)?.name}</TableCell>
                    <TableCell>₹{service.price}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog('services', service)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete('services', service.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog('services')}
            sx={{ mt: 2 }}
          >
            Add Service
          </Button>
        </Box>

        {/* Logout */}
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentItem?.id ? `Edit ${dialogType}` : `Add ${dialogType}`}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            {dialogType === 'departments' && (
              <TextField
                label="Department Name"
                fullWidth
                value={currentItem?.name || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
              />
            )}

            {dialogType === 'doctors' && (
              <>
                <TextField
                  label="Doctor Name"
                  fullWidth
                  value={currentItem?.name || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Specialization"
                  fullWidth
                  value={currentItem?.specialization || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, specialization: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  label="Department"
                  fullWidth
                  value={currentItem?.department_id || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, department_id: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ mb: 2 }}
                >
                  <option value=""></option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </TextField>
              </>
            )}

            {dialogType === 'services' && (
              <>
                <TextField
                  label="Service Name"
                  fullWidth
                  value={currentItem?.name || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  label="Department"
                  fullWidth
                  value={currentItem?.department_id || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, department_id: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ mb: 2 }}
                >
                  <option value=""></option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  value={currentItem?.price || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleSave(dialogType, currentItem)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </Container>

  );
}

export default ClinicSettings;
