import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Community = () => {
  const discussions = [
    {
      id: 1,
      title: "Best Camera Settings for Outdoor Portraits",
      author: "Sarah Johnson",
      replies: 23,
      category: "Tips & Tricks",
    },
    {
      id: 2,
      title: "How to Build Your Photography Portfolio",
      author: "Mike Chen",
      replies: 15,
      category: "Career",
    },
    {
      id: 3,
      title: "Natural Light vs Studio Light Discussion",
      author: "Emma Davis",
      replies: 42,
      category: "Techniques",
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Forum
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect, learn, and share with fellow photographers
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="card card-hover cursor-pointer">
                <div className="card-header">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="card-title">{discussion.title}</h3>
                      <p className="card-description">
                        Started by {discussion.author}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="badge badge-secondary">
                        {discussion.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {discussion.replies} replies
                      </span>
                    </div>
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

export default Community;
