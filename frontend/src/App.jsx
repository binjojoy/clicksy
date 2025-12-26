import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// We will create these pages in the next steps
import HomePage from './pages/HomePage';
import Auth from './pages/LoginPage';
import Booking from './pages/Booking';
import Community from './pages/Community';
import Learn from './pages/Learn';
import About from './pages/About';
import Marketplace from './pages/Marketplace';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UploadPortfolio from './pages/UploadPortfolio';
import ManageBookings from './pages/ManageBooking';
import SellItem from './pages/SellItem';
// import AuthPage from './pages/AuthPage';
// import PortfolioPage from './pages/PortfolioPage';
// import BookingPage from './pages/BookingPage';
// import CommunityPage from './pages/CommunityPage';
// import LearnPage from './pages/LearnPage';
// import MarketplacePage from './pages/MarketplacePage';
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';
// import NotFoundPage from './pages/NotFoundPage';

// The original project used QueryClient, Toasters, etc.
// We can add those back in later when we need them.
// For now, let's keep it simple.

function App() {
  return (
    <Router>
      {/* The Navbar and Footer can be placed here, outside the <Routes>, 
        so they appear on every page. This is a common and good practice.
      */}
      {/* <Navbar /> */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/booking" element={<Booking />} /> 
          <Route path="/community" element={<Community />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/about" element={<About />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/dashboard' element={<Dashboard/>} /> 
          <Route path='/profile' element={<Profile/>} />
          <Route path='/upload-portfolio' element={<UploadPortfolio/>} />
          <Route path='/manage-bookings' element={<ManageBookings/>} />
          <Route path='/marketplace/sell-item' element={<SellItem/>} />
          {/* We can add the routes for the other pages as we create them.
            For example:
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
