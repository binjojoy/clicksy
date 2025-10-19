import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  const features = [
    {
      icon: "camera",
      title: "Portfolio Showcase",
      description: "Create stunning galleries to showcase your photography work",
    },
    {
      icon: "calendar",
      title: "Easy Booking",
      description: "Manage bookings and payments seamlessly in one place",
    },
    {
      icon: "users",
      title: "Collaborate",
      description: "Connect with photographers and learners worldwide",
    },
    {
      icon: "book",
      title: "Learn & Grow",
      description: "Access tutorials and resources to improve your skills",
    },
    {
      icon: "shopping",
      title: "Marketplace",
      description: "Buy or rent photography equipment from trusted sellers",
    },
    {
      icon: "sparkles",
      title: "Community",
      description: "Join discussions and share experiences with fellow photographers",
    },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      camera: <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />,
      calendar: <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />,
      users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
      book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
      shopping: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
      sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></>,
    };
    return icons[iconName];
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="hero-gradient hero-section px-4">
        <div className="container text-center">
          <h1 className="hero-title">
            One Click,{" "}
            <span className="gradient-text">Infinite Possibilities</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate platform for photographers to showcase, manage, and grow
          </p>
          <div className="hero-buttons">
            <Link to="/auth" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/portfolio" className="btn btn-outline btn-lg">
              Explore Portfolios
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed for modern photographers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover feature-card">
                <div className="feature-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--primary-foreground)' }}
                  >
                    {renderIcon(feature.icon)}
                  </svg>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Photography Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of photographers who trust CLICKSY for their creative workflow
          </p>
          <Link to="/auth" className="btn btn-primary btn-lg">
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
