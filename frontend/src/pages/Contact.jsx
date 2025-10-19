import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div style={{ gridColumn: 'span 2 / span 2' }}>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Send us a message</h2>
                  <p className="card-description">
                    Fill out the form below and we'll respond as soon as possible
                  </p>
                </div>
                <div className="card-content">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label htmlFor="name" className="label">Name</label>
                        <input id="name" type="text" placeholder="John Doe" required className="input" />
                      </div>
                      <div className="input-group">
                        <label htmlFor="email" className="label">Email</label>
                        <input id="email" type="email" placeholder="john@example.com" required className="input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label htmlFor="subject" className="label">Subject</label>
                      <input id="subject" type="text" placeholder="How can we help?" required className="input" />
                    </div>
                    <div className="input-group">
                      <label htmlFor="message" className="label">Message</label>
                      <textarea id="message" placeholder="Your message..." required className="textarea" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="card-content">
                  <div className="flex items-center gap-3 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <h3 className="font-semibold">Email</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">hello@clicksy.com</p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div className="flex items-center gap-3 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <h3 className="font-semibold">Phone</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div className="flex items-center gap-3 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h3 className="font-semibold">Location</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
