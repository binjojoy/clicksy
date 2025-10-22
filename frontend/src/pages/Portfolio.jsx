import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import './Portfolio.css'; // 💡 Make sure you import the CSS here

// Import your images (assuming .jpg extension)
import image1 from "../assets/image1.jpg"; 
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";

const Portfolio = () => {
  // Using 3 images and repeating them to fill 6 slots
  const portfolioItems = [
    { id: 1, title: "Sunset Landscape", category: "Nature", image: image1 },
    { id: 2, title: "Urban Architecture", category: "Architecture", image: image2 },
    { id: 3, title: "Portrait Session", category: "Portrait", image: image3 },
    { id: 4, title: "Wildlife Safari", category: "Wildlife", image: image2 }, 
    { id: 5, title: "Street Photography", category: "Street", image: image1 }, 
    { id: 6, title: "Food Styling", category: "Food", image: image3 }, 
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h1 className="main-title">
              Featured Portfolios
            </h1>
            <p className="subtitle">
              Discover amazing work from talented photographers
            </p>
          </div>

          {/* 🚀 Grid Container for the 2x3 Layout */}
          <div className="portfolio-grid-2x3"> 
            {portfolioItems.map((item) => (
              <div key={item.id} className="portfolio-card">
                  <img 
                        src={item.image} 
                        alt={item.title} 
                        className="portfolio-image" 
                    />
                  {/* Overlay for text and hover effect */}
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