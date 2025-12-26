import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import './Marketplace.css';

const Marketplace = () => {
  const items = [
    { id: 1, name: "Canon EOS R5", price: "$3,899", type: "sale", location: "New York, NY" },
    { id: 2, name: "Sony A7 III Kit", price: "$150/day", type: "rent", location: "Los Angeles, CA" },
    { id: 3, name: "Studio Lights", price: "$899", type: "sale", location: "Chicago, IL" },
    { id: 4, name: "DJI Ronin RS3", price: "$75/day", type: "rent", location: "Miami, FL" },
    { id: 5, name: "FujiFilm XT-5", price: "$1,699", type: "sale", location: "Seattle, WA" },
    { id: 6, name: "Godox AD200", price: "$299", type: "sale", location: "Austin, TX" },
  ];

  return (
    <div className="marketplace-page">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <svg
              width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="mx-auto mb-4" style={{ color: 'var(--primary)' }}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Equipment Marketplace
            </h1>
            <p className="text-xl text-gray-400">
              Buy, sell, or rent professional gear
            </p>
          </div>

          {/* New CSS Grid Layout */}
          <div className="marketplace-grid">
            {items.map((item) => (
              <div key={item.id} className="market-card">
                
                {/* Card Top: Badges & Price */}
                <div className="card-top">
                  <span className={`badge-${item.type}`}>
                      {item.type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                  </span>
                  <span className="item-price">{item.price}</span>
                </div>
                
                {/* Item Details */}
                <div>
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.location}
                  </p>
                </div>

                {/* Smaller, cleaner button */}
                <Link to={`/marketplace/item/${item.id}`} className="btn-details">
                  View Details →
                </Link>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Floating Add Button */}
      <Link to="/marketplace/sell" className="fab-add-item" title="Sell Item">
        <svg className="fab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      <Footer />
    </div>
  );
};

export default Marketplace;