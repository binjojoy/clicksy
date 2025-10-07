import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPages from './pages/RegisterPages';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage'; // Placeholder

function App() {
    return (
        <Router>
            <Routes>
                {/* User Management Module Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPages />} />
                
                {/* Protected Routes (Placeholder) */}
                <Route path="/dashboard" element={<DashboardPage />} /> 

                {/* Catch-all Route for 404 (optional) */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
}

export default App;