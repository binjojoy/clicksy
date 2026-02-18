// frontend/src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "../components/Toaster.jsx"; 
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:5000/api/v1/auth';

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("signin");
    
    // 1. NEW STATE: Holds the success message
    const [successMsg, setSuccessMsg] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg(""); // Clear any old messages

        const formData = new FormData(e.currentTarget);
        const email = formData.get("signup-email");
        const password = formData.get("signup-password");
        const fullName = formData.get("full-name");
        const userType = formData.get("user-type"); 

        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                email,
                password,
                userType,
                fullName 
            });

            // 2. SET SUCCESS MESSAGE: This triggers the green container to appear
            setSuccessMsg("Sign up successful! Please log in to your account.");

            toast.success(response.data.message || "Registration successful! Check your email for verification.");
            setActiveTab("signin");

        } catch (error) {
            console.error("Registration Error:", error.response?.data);
            const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("signin-email");
        const password = formData.get("signin-password");

        try {
            // 0. CLEAR OLD DATA FIRST (Fixes the "stale data" glitch)
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');

            // 1. API Call
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password,
            });

            // Log response to verify (check console)
            console.log("Login Response:", response.data);

            const user = response.data.user;
            
            // 2. Save Token
            if (user.token) {
                localStorage.setItem('userToken', user.token);
            }

            // 3. Save Name
            if (user.fullName) {
                localStorage.setItem('userName', user.fullName);
            }

            if (user.id) {
                localStorage.setItem('user_id', user.id);
            }

            // 👇 4. CRITICAL FIX: Use 'userType' (from your JSON) 👇
            if (user.userType) {
                const normalizedRole = user.userType.toLowerCase(); 
                localStorage.setItem('userRole', normalizedRole);
                console.log("Role saved as:", normalizedRole);
            } else {
                // Only default to client if strictly necessary
                console.warn("No userType found in response, defaulting to client");
                localStorage.setItem('userRole', 'client'); 
            }
            
            toast.success(`Welcome back, ${user.fullName || user.email}!`);
            
            // 👇 5. FORCE REFRESH TO UPDATE NAVBAR 👇
            // Instead of navigate(), we use window.location.href.
            // This forces the whole page to reload, ensuring Navbar reads the new role.
            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Login Error:", error.response?.data);
            const errorMessage = error.response?.data?.error || "Login failed.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
            <div 
                className="w-full max-w-md mx-auto"
                style={{ 
                    maxWidth: '450px', 
                    margin: '0 auto'
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
                        
                        {/* 3. SHOW CONTAINER: Only if successMsg has text */}
                        {successMsg && (
                            <div style={{
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                borderRadius: 'var(--radius)',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)', // Subtle Green BG
                                border: '1px solid #22c55e',              // Green Border
                                color: '#22c55e',                         // Green Text
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}>
                                {successMsg}
                            </div>
                        )}

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
                                    onClick={() => {
                                        setActiveTab('signup');
                                        setSuccessMsg(""); // Clear message if they switch back to signup
                                    }}
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
                                        {/* USER TYPE: Selector */}
                                        <div className="input-group">
                                            <label htmlFor="user-type" className="label">Account Type</label>
                                            <select
                                                id="user-type"
                                                name="user-type"
                                                required
                                                defaultValue="client"
                                                className="input"
                                            >
                                                <option value="client">Client</option>
                                                <option value="photographer">Photographer</option>
                                            </select>
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