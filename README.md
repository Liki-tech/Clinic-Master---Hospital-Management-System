# Clinic Management System

A comprehensive clinic management system built with a React frontend and Node.js backend, designed to streamline clinic operations, patient management, and billing.

## Features
- **Appointment Scheduling**: Manage appointments with drag-and-drop functionality.
- **Patient Management**: Track patient records and medical history.
- **Billing System**: Generate and manage invoices and payments.
- **Financial Tracking**: Monitor expenses and revenue.
- **User Authentication**: Secure login and role-based access control.

## Technologies Used
- **Frontend**: React, Material-UI, FullCalendar
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: Neon (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (or Neon database)
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Liki-tech/clinic-management-system.git

2. Install backend dependencies:
    cd backend
    npm install

3. Install frontend dependencies:
    cd ../frontend
    npm install

### Configuration
1. Create a .env file in the backend directory with the following:
    DATABASE_URL=your_neon_database_url
    JWT_SECRET=your_jwt_secret
    PORT=5001

2. Create a .env file in the frontend directory with the following:
    REACT_APP_API_URL=http://localhost:5001

### Running the Application
1. Start the backend server:
    cd backend
    npm start

2. Start the frontend development server:
    cd ../frontend
    npm start

### Deployment
   **Frontend**: Deploy the frontend on Netlify or Vercel.
    **Backend**: Deploy the backend on Render or Heroku.

### Project Structure 

        clinic-management-system/
        ├── backend/            # Backend server code
        ├── frontend/           # Frontend React application
        ├── README.md           # Project documentation
        └── .gitignore          # Git ignore file


### Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeature).
Open a pull request.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgments
Material-UI for UI components
FullCalendar for appointment scheduling
Neon for PostgreSQL hosting
