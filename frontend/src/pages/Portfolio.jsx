import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Portfolio = () => {
  const portfolioItems = [
    { id: 1, title: "Sunset Landscape", category: "Nature" },
    { id: 2, title: "Urban Architecture", category: "Architecture" },
    { id: 3, title: "Portrait Session", category: "Portrait" },
    { id: 4, title: "Wildlife Safari", category: "Wildlife" },
    { id: 5, title: "Street Photography", category: "Street" },
    { id: 6, title: "Food Styling", category: "Food" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Portfolios
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover amazing work from talented photographers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="card card-hover overflow-hidden group cursor-pointer">
                <div className="card-content p-0">
                  <div className="image-overlay aspect-square flex items-center justify-center" style={{
                    background: 'linear-gradient(to bottom right, hsl(263, 70%, 50%, 0.2), hsl(14, 100%, 65%, 0.2))'
                  }}>
                    <div className="text-center p-6">
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.category}</p>
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

export default Portfolio;
