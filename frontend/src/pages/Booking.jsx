import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";

const Booking = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Booking request submitted! We'll contact you soon.");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-2xl">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book a Session
            </h1>
            <p className="text-xl text-muted-foreground">
              Let's capture your special moments
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Event Details</h2>
              <p className="card-description">
                Fill in the details below and we'll get back to you
              </p>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="name" className="label">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="input"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="email" className="label">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="phone" className="label">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      className="input"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="date" className="label">Preferred Date</label>
                    <input
                      id="date"
                      type="date"
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="event-type" className="label">Event Type</label>
                  <input
                    id="event-type"
                    type="text"
                    placeholder="Wedding, Portrait, Event, etc."
                    required
                    className="input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="message" className="label">Additional Details</label>
                  <textarea
                    id="message"
                    placeholder="Tell us more about your event..."
                    required
                    className="textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Submit Booking Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
