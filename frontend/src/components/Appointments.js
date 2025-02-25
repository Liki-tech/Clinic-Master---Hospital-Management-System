import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';

import { styled } from '@mui/material/styles';

import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';

import { Add, Check, Close, Delete, AttachMoney } from '@mui/icons-material';


import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Appointments() {
  const calendarRef = useRef(null);
const [appointments, setAppointments] = useState([]);
const [showDustbin, setShowDustbin] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    patientId: null,
    start: '',
    end: '',
    allDay: false
  });

  const [filters, setFilters] = useState({
    doctor: '',
    department: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

const handleDateClick = (arg) => {
  if (arg.jsEvent.button === 2) { // Right click
    setSelectedEvent({
      start: arg.dateStr,
      end: arg.dateStr,
      allDay: arg.allDay
    });
    setOpenDialog(true);
    return;
  }

    setSelectedEvent({
      start: arg.dateStr,
      end: arg.dateStr,

      allDay: arg.allDay
    });
    setOpenDialog(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setOpenDialog(true);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

const handleStatusChange = async (appointmentId, status) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {

        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setAppointments(prev => prev.map(app => 
          app.id === appointmentId ? { ...app, status } : app
        ));
        setSnackbar({
          open: true,
          message: `Appointment marked as ${status}`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbar({
        open: true,
        message: 'Error updating appointment',
        severity: 'error'
      });
    }
  };

  const handleSaveAppointment = async (appointment) => {
    try {
      const method = selectedEvent?.id ? 'PUT' : 'POST';
      const url = selectedEvent?.id 
        ? `/api/appointments/${selectedEvent.id}`
        : '/api/appointments';

      const response = await fetch('/api/appointments', {

        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments(prev => {
          const existing = prev.find(app => app.id === updatedAppointment.id);
          return existing
            ? prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app)
            : [...prev, updatedAppointment];
        });
        setSnackbar({
          open: true,
          message: `Appointment ${selectedEvent?.id ? 'updated' : 'created'} successfully`,
          severity: 'success'
        });
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      setSnackbar({
        open: true,
        message: 'Error saving appointment',
        severity: 'error'
      });
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${selectedEvent.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAppointments(prev => prev.filter(app => app.id !== selectedEvent.id));
        setSnackbar({
          open: true,
          message: 'Appointment deleted successfully',
          severity: 'success'
        });
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting appointment',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

const handleEventDrag = (info) => {
  setShowDustbin(true);
};

const handleEventDrop = async (info) => {
  setShowDustbin(false);
  
  // Check if dropped on dustbin
  const dustbin = document.getElementById('dustbin');
  if (dustbin && dustbin.contains(info.jsEvent.target)) {
    await handleStatusChange(info.event.id, 'cancelled');
    return;
  }

  // Update appointment time
  try {
    const response = await fetch(`/api/appointments/${info.event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: info.event.startStr,
        end: info.event.endStr
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update appointment');
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    setSnackbar({
      open: true,
      message: 'Error updating appointment',
      severity: 'error'
    });
  }
};

const navigate = useNavigate();

const renderEventContent = (eventInfo) => {



    const statusColor = {
      scheduled: '#2196f3',
      completed: '#4caf50',
      cancelled: '#f44336'
    }[eventInfo.event.extendedProps.status] || '#2196f3';

    return (
      <Box sx={{ 
        backgroundColor: statusColor,
        color: '#fff',
        p: 1,
        borderRadius: 1
      }}>
        <Typography 
          variant="body2"
          onClick={(e) => {
            e.stopPropagation();
            if (eventInfo.event.extendedProps.patientId) {
              navigate(`/patients/${eventInfo.event.extendedProps.patientId}`);
            }
          }}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {eventInfo.event.title}
        </Typography>

        <Typography variant="caption">
          {eventInfo.timeText}
        </Typography>
        {eventInfo.event.extendedProps.status === 'scheduled' && (
          <Box sx={{ mt: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(eventInfo.event.id, 'completed');
              }}
              sx={{ color: '#fff' }}
            >
              <Check fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(eventInfo.event.id, 'cancelled');
              }}
              sx={{ color: '#fff' }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Appointments
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ mr: 2, minWidth: 200 }}>
            <InputLabel>Doctor</InputLabel>
            <Select
              name="doctor"
              value={filters.doctor}
              onChange={handleFilterChange}
              label="Doctor"
            >
              <MenuItem value="">All Doctors</MenuItem>
              {/* Populate with doctors from API */}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              {/* Populate with departments from API */}
            </Select>
          </FormControl>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ position: 'relative' }}>
            {showDustbin && (
              <Box
                id="dustbin"
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  zIndex: 1000,
                  p: 2,
                  backgroundColor: '#ffebee',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Delete fontSize="large" color="error" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Drop here to cancel
                </Typography>
              </Box>
            )}
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            events={appointments}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDragStart={handleEventDrag}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            droppable={true}

          />
        </Box>

        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {selectedEvent?.id ? 'Edit Appointment' : 'Add Appointment'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Add appointment form fields here */}
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Patient Information
                </Typography>
                <TextField
                  fullWidth
                  label="Select Patient"
                  variant="outlined"
                  margin="normal"
                  select
                  value={selectedEvent?.patientId || ''}
                  onChange={(e) => setSelectedEvent(prev => ({
                    ...prev,
                    patientId: e.target.value
                  }))}
                >
                  <MenuItem value="">Select a patient</MenuItem>
                  {/* Populate with patients from API */}
                </TextField>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Billing Information
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AttachMoney />}
                  onClick={() => {
                    // Navigate to billing page with patient ID
                    navigate(`/billing?patientId=${selectedEvent?.patientId}`);
                  }}
                >
                  Create Bill
                </Button>
              </Box>

            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            {selectedEvent?.id && (
              <StyledButton color="error" onClick={handleDeleteAppointment}>
                Delete
              </StyledButton>
            )}
            <StyledButton variant="contained" onClick={handleSaveAppointment}>
              Save
            </StyledButton>
          </DialogActions>
        </Dialog>
      </Paper>

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
    </Container>
  );
}

export default Appointments;
