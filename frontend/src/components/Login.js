import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import logo from '../assets/clinic-logo.png';




import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import PropTypes from 'prop-types';



function Login({ setIsAuthenticated }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password, clinicId }),


      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setIsAuthenticated(true);
      navigate('/appointments');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
    }


  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >

        <Box sx={{ mb: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={logo} 
            alt="Clinic Master Logo" 
            style={{ 
              width: '100%',
              maxWidth: '750px',
              height: 'auto',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
        </Box>









        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            type="email"
            placeholder="Enter your email"
          />

          <TextField
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            required
            placeholder="Enter your clinic ID"
          />


          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1,
              textAlign: 'right',
              color: '#666',
              '&:hover': {
                color: '#1976d2',
                cursor: 'pointer'
              }
            }}
            onClick={() => alert('Please contact your system administrator for password assistance.')}
          >
            Forgot password?
          </Typography>

            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2,
                  p: 2,
                  backgroundColor: '#ffeeee',
                  borderRadius: '4px',
                  border: '1px solid #ffcccc'
                }}
              >
                {error}
              </Typography>
            )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 3, 
              mb: 1,
              bgcolor: '#1a237e',
              '&:hover': {
                bgcolor: '#0d47a1',
                transform: 'scale(1.02)'
              },
              transition: 'all 0.3s ease',
              boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Login
          </Button>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              color: '#666',
              mb: 1
            }}
          >
            Please contact Help center if you have trouble logging in
          </Typography>


        </Box>
        </Paper>
      </Box>
    </Container>


  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
