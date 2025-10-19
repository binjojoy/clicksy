import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Marketplace = () => {
  const items = [
    {
      id: 1,
      name: "Canon EOS R5",
      price: "$3,899",
      type: "For Sale",
      location: "New York, NY",
    },
    {
      id: 2,
      name: "Sony A7 III with Lens Kit",
      price: "$150/day",
      type: "For Rent",
      location: "Los Angeles, CA",
    },
    {
      id: 3,
      name: "Professional Studio Lighting Set",
      price: "$899",
      type: "For Sale",
      location: "Chicago, IL",
    },
    {
      id: 4,
      name: "DJI Ronin RS3 Pro Gimbal",
      price: "$75/day",
      type: "For Rent",
      location: "Miami, FL",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mx-auto mb-4"
              style={{ color: 'var(--primary)' }}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Equipment Marketplace
            </h1>
            <p className="text-xl text-muted-foreground">
              Buy or rent professional photography equipment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card card-hover">
                <div className="card-header">
                  <div className="flex items-start justify-between mb-2">
                    <span className="badge">{item.type}</span>
                    <span className="text-lg font-bold text-primary">{item.price}</span>
                  </div>
                  <h3 className="card-title">{item.name}</h3>
                  <p className="card-description flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.location}
                  </p>
                </div>
                <div className="card-content">
                  <button className="btn btn-primary w-full">Contact Seller</button>
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

export default Marketplace;
