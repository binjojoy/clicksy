import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from 'react-router-dom'; // 1. Import Navigation Hook
import '../styles/Portfolio.css'; 

// Import your assets (Keep your existing imports)
// import image1 from "../assets/image1.jpg"; 
// ...

const Portfolio = () => {
  const navigate = useNavigate(); // 2. Initialize Hook

  // Mock data matches your categories
  // Note: 'slug' is the URL-friendly version (e.g. "Nature" -> "nature")
  const portfolioItems = [
    { id: 1, title: "Sunset Landscape", category: "Nature", slug: "nature", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80" },
    { id: 2, title: "Urban Architecture", category: "Architecture", slug: "architecture", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
    { id: 3, title: "Portrait Session", category: "Portrait", slug: "portrait", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80" },
    { id: 4, title: "Wildlife Safari", category: "Wildlife", slug: "wildlife", image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&q=80" }, 
    { id: 5, title: "Street Photography", category: "Street", slug: "street", image: "https://images.unsplash.com/photo-1542259681-d212fa28d027?w=800&q=80" }, 
    { id: 6, title: "Fashion & Style", category: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" }, 
  ];

  const handleCardClick = (slug) => {
     // 3. Navigate to the dynamic sub-page
     navigate(`/portfolio/${slug}`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h1 className="main-title">Featured Portfolios</h1>
            <p className="subtitle">Discover amazing work from talented photographers</p>
          </div>

          <div className="portfolio-grid-2x3"> 
            {portfolioItems.map((item) => (
              <div 
                key={item.id} 
                className="portfolio-card"
                onClick={() => handleCardClick(item.slug)} // 4. Add Click Handler
              >
                  <img 
                        src={item.image} 
                        alt={item.title} 
                        className="portfolio-image" 
                    />
                  <div className="portfolio-overlay"> 
                    <div className="portfolio-text">
                      <h3 className="overlay-title">{item.title}</h3>
                      <p className="overlay-category">{item.category}</p>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;