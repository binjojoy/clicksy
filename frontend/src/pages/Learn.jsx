import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Learn = () => {
  const resources = [
    {
      id: 1,
      title: "Photography Basics for Beginners",
      description: "Learn the fundamentals of photography and camera settings",
      category: "Beginner",
      duration: "45 min",
    },
    {
      id: 2,
      title: "Advanced Lighting Techniques",
      description: "Master natural and artificial lighting for professional results",
      category: "Advanced",
      duration: "1.5 hours",
    },
    {
      id: 3,
      title: "Portrait Photography Masterclass",
      description: "Perfect your portrait photography skills and client interaction",
      category: "Intermediate",
      duration: "2 hours",
    },
    {
      id: 4,
      title: "Post-Processing with Lightroom",
      description: "Edit your photos like a pro with Adobe Lightroom",
      category: "Intermediate",
      duration: "1 hour",
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learning Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Enhance your photography skills with expert tutorials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="card card-hover cursor-pointer">
                <div className="card-header">
                  <div className="flex items-start justify-between mb-2">
                    <span className="badge badge-accent">{resource.category}</span>
                    <span className="text-sm text-muted-foreground">{resource.duration}</span>
                  </div>
                  <h3 className="card-title">{resource.title}</h3>
                  <p className="card-description">{resource.description}</p>
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

export default Learn;
