import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Component Imports
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
import EditProfile from './pages/EditProfile'; 
import CategoryGallery from './pages/CategoryGallery';
import ItemDetails from './pages/ItemDetails';
import ExplorePage from "./pages/ExplorePage";
import ExplorePhotographer from "./pages/ExplorePhotographer";
import SavedPage from "./pages/SavedPage";
import ClientBooking from "./pages/ClientBooking";
import Profiles from './pages/Profiles';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NetworkError from './pages/NetworkError';
import NotFound from './pages/NotFound';
import NotificationsPage from './pages/NotificationsPage';

// Security & Transitions
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 Import your new bouncer

function App() {
  const location = useLocation();

  return (
    <main className="w-full h-full">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* ==========================================
              🔓 PUBLIC ROUTES (Anyone can access)
              ========================================== */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/terms-and-conditions" element={<PageTransition><Terms/></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><Privacy/></PageTransition>} />
          
          {/* Publicly viewable profiles and items */}
          <Route path="/explore" element={<PageTransition><ExplorePage /></PageTransition>} />
          <Route path="/profiles" element={<PageTransition><Profiles /></PageTransition>} />
          <Route path="/profile/:id" element={<PageTransition><Profiles /></PageTransition>} />
          <Route path="/portfolio/:category" element={<PageTransition><CategoryGallery /></PageTransition>} />
          <Route path="/marketplace/item/:id" element={<PageTransition><ItemDetails /></PageTransition>} />
          <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />

          {/* Errors */}
          <Route path="*" element={<PageTransition><NotFound/></PageTransition>} />
          <Route path="/error" element={<PageTransition><NetworkError/></PageTransition>} />

          {/* ==========================================
              🔒 PROTECTED ROUTES (Requires Login)
              ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/edit-profile" element={<PageTransition><EditProfile /></PageTransition>} />
            
            {/* Features that require a logged-in user */}
            <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
            <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
            <Route path="/learn" element={<PageTransition><Learn /></PageTransition>} />
            <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
            <Route path="/explore-photographers" element={<PageTransition><ExplorePhotographer /></PageTransition>} />
            <Route path="/saved" element={<PageTransition><SavedPage /></PageTransition>} />
            //done and dusted
            {/* Action pages */}
            <Route path="/upload-portfolio" element={<PageTransition><UploadPortfolio /></PageTransition>} />
            <Route path="/manage-bookings" element={<PageTransition><ManageBookings /></PageTransition>} />
            <Route path="/marketplace/sell-item" element={<PageTransition><SellItem /></PageTransition>} />
            <Route path="/my-bookings" element={<PageTransition><ClientBooking /></PageTransition>} />
            <Route path="/activity" element={<PageTransition><NotificationsPage /></PageTransition>} />
          </Route>

        </Routes>
      </AnimatePresence>
    </main>
  );
}

export default App;