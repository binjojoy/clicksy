import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Removed BrowserRouter here
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
import EditProfile from './pages/EditProfile'; // Note: You had Profile imported as EditProfile
import CategoryGallery from './pages/CategoryGallery';
import ItemDetails from './pages/ItemDetails';
import ExplorePage from "./pages/ExplorePage";
import SavedPage from "./pages/SavedPage";
import ClientBooking from "./pages/ClientBooking";
import Profiles from './pages/Profiles';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NetworkError from './pages/NetworkError';
import NotFound from './pages/NotFound';

// Transition Wrapper
import PageTransition from './components/PageTransition';

function App() {
  // We need the location to identify unique pages for the animation
  const location = useLocation();

  return (
    <>
      {/* Navbar can go here if you want it to stay visible 
         while the page content animates underneath it.
         <Navbar /> 
      */}

      <main className="w-full h-full">
        {/* mode="wait" ensures the old page fades out BEFORE the new one fades in */}
        <AnimatePresence mode="wait">
          
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={
              <PageTransition><HomePage /></PageTransition>
            } />
            
            <Route path="/auth" element={
              <PageTransition><Auth /></PageTransition>
            } />
            
            <Route path="/booking" element={
              <PageTransition><Booking /></PageTransition>
            } />
            
            <Route path="/community" element={
              <PageTransition><Community /></PageTransition>
            } />
            
            
            <Route path="/learn" element={
              <PageTransition><Learn /></PageTransition>
            } />
            
            <Route path="/about" element={
              <PageTransition><About /></PageTransition>
            } />

            <Route path="/profiles" element={
              <PageTransition><Profiles /></PageTransition>
            } />

            <Route path="/profile/:id" element={
              <PageTransition><Profiles /></PageTransition>
            } />
            
            <Route path="/marketplace" element={
              <PageTransition><Marketplace /></PageTransition>
            } />
            
            <Route path="/portfolio" element={
              <PageTransition><Portfolio /></PageTransition>
            } />
            
            <Route path="/contact" element={
              <PageTransition><Contact /></PageTransition>
            } />
            
            <Route path="/dashboard" element={
              <PageTransition><Dashboard /></PageTransition>
            } />
            
            <Route path="/profile" element={
              <PageTransition><Profile /></PageTransition>
            } />
            

            <Route path="/upload-portfolio" element={
              <PageTransition><UploadPortfolio /></PageTransition>
            } />
            
            <Route path="/manage-bookings" element={
              <PageTransition><ManageBookings /></PageTransition>
            } />
            
            <Route path="/marketplace/sell-item" element={
              <PageTransition><SellItem /></PageTransition>
            } />
            
            <Route path="/edit-profile" element={
              <PageTransition><EditProfile /></PageTransition>
            } />
            
            <Route path="/portfolio/:category" element={
              <PageTransition><CategoryGallery /></PageTransition>
            } />
            
            <Route path="/marketplace/item/:id" element={
              <PageTransition><ItemDetails /></PageTransition>
            } />
            
            <Route path="/explore" element={
              <PageTransition><ExplorePage /></PageTransition>
            } />
            
            <Route path="/saved" element={
              <PageTransition><SavedPage /></PageTransition>
            } />
            
            <Route path="/my-bookings" element={
              <PageTransition><ClientBooking /></PageTransition>
            } />

            <Route path='/terms-and-conditions' element={
              <PageTransition><Terms/></PageTransition>
            } />
            
            <Route path='/privacy-policy' element={
              <PageTransition><Privacy/></PageTransition>
            } />
            <Route path="*" element={
              <PageTransition><NotFound/></PageTransition>
            } />
            <Route path="/error" element={<PageTransition><NetworkError/></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* <Footer /> */}
    </>
  );
}

export default App;