import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            About CLICKSY
          </h1>

          <div className="card mb-8">
            <div className="card-content p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6" style={{ lineHeight: '1.8' }}>
                CLICKSY was created to solve the challenges photographers face in today's digital world.
                We bring together portfolio management, client bookings, community collaboration, and
                equipment marketplace in one seamless platform.
              </p>

              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Professional portfolio showcases to display your best work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Streamlined booking and payment management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Vibrant community for collaboration and learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Comprehensive learning resources and tutorials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Trusted marketplace for equipment buying and renting</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-content p-8">
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground mb-6" style={{ lineHeight: '1.8' }}>
                Whether you're a beginner learning the basics or a seasoned professional looking to
                expand your business, CLICKSY has everything you need to succeed in your photography
                journey.
              </p>
              <a href="/auth" className="btn btn-primary">
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
