import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "../components/Toaster.jsx";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email");
    const password = formData.get("signup-password");
    const fullName = formData.get("full-name");

    // Simulated signup (replace with actual Supabase integration)
    setTimeout(() => {
      toast.success("Account created! Please check your email to verify.");
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email");
    const password = formData.get("signin-password");

    // Simulated signin (replace with actual Supabase integration)
    setTimeout(() => {
      toast.success("Welcome back!");
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
      {/* *** FIX APPLIED HERE: Added 'mx-auto' and explicit inline 'max-width' *** */}
      <div 
          className="w-full max-w-md mx-auto"
          style={{ 
            maxWidth: '450px', // Forces a max width
            margin: '0 auto' // Ensures centering
          }}
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius)',
            background: 'var(--gradient-primary)'
          }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--primary-foreground)' }}
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <span className="text-2xl font-bold gradient-text">CLICKSY</span>
        </Link>

        <div className="card">
          <div className="card-header text-center">
            <h1 className="card-title">Welcome to CLICKSY</h1>
            <p className="card-description">Sign in to your account or create a new one</p>
          </div>
          <div className="card-content">
            <div className="tabs">
              <div className="tabs-list">
                <button
                  className={`tabs-trigger ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                </button>
                <button
                  className={`tabs-trigger ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              {activeTab === 'signin' && (
                <div className="tabs-content">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="input-group">
                      <label htmlFor="signin-email" className="label">Email</label>
                      <input
                        id="signin-email"
                        name="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="input"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="signin-password" className="label">Password</label>
                      <input
                        id="signin-password"
                        name="signin-password"
                        type="password"
                        required
                        className="input"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'signup' && (
                <div className="tabs-content">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="input-group">
                      <label htmlFor="full-name" className="label">Full Name</label>
                      <input
                        id="full-name"
                        name="full-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="input"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="signup-email" className="label">Email</label>
                      <input
                        id="signup-email"
                        name="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="input"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="signup-password" className="label">Password</label>
                      <input
                        id="signup-password"
                        name="signup-password"
                        type="password"
                        required
                        className="input"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;