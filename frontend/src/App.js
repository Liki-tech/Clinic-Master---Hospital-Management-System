import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Appointments from './components/Appointments';
import PatientRecords from './components/PatientRecords';
import Billing from './components/Billing';
import Financials from './components/Financials';
import ClinicSettings from './components/ClinicSettings';
import Navbar from './components/Navbar';






function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? 
            <Login setIsAuthenticated={setIsAuthenticated} /> 
            : <Navigate to="/" />
        } />
        
        {isAuthenticated && (
          <>
            <Route path="/" element={<Appointments />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patients" element={<PatientRecords />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/settings" element={<ClinicSettings />} />
          </>
        )}
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>


    </Router>


  );
}

export default App;
