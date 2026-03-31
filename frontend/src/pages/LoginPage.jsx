// frontend/src/pages/Auth.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from "../components/Toaster.jsx"; 
import { Camera, Eye, EyeOff, Mail, Lock, User, ArrowRight, Briefcase, ChevronDown } from "lucide-react";
import "../styles/Auth.css"; 

const API_BASE_URL = 'http://localhost:5000/api/v1/auth';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("signin");
    const [successMsg, setSuccessMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false); // NEW STATE FOR CHECKBOX

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        // Extra safeguard in case HTML validation is bypassed
        if (!agreedToTerms) {
            toast.error("You must agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setLoading(true);
        setSuccessMsg(""); 

        const formData = new FormData(e.currentTarget);
        const email = formData.get("signup-email");
        const password = formData.get("signup-password");
        const fullName = formData.get("full-name");
        const userType = formData.get("user-type"); 

        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                email, password, userType, fullName 
            });

            setSuccessMsg("Sign up successful! Please log in to your account.");
            toast.success(response.data.message || "Registration successful!");
            setActiveTab("signin");
            setShowPassword(false);
            setAgreedToTerms(false); // Reset checkbox on success

        } catch (error) {
            // NETWORK ERROR REDIRECT
            if (!error.response) {
                window.location.href = '/error';
                return;
            }
            
            console.error("Registration Error:", error.response?.data);
            const errorMessage = error.response?.data?.error || "Registration failed.";
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
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('user_id');

            const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
            const user = response.data.user;
            
            if (user.token) localStorage.setItem('userToken', user.token);
            if (user.fullName) localStorage.setItem('userName', user.fullName);
            if (user.id) localStorage.setItem('user_id', user.id);

            if (user.userType) {
                localStorage.setItem('userRole', user.userType.toLowerCase());
            } else {
                localStorage.setItem('userRole', 'client'); 
            }
            
            toast.success(`Welcome back, ${user.fullName || user.email}!`);
            window.location.href = "/dashboard";

        } catch (error) {
            // NETWORK ERROR REDIRECT
            if (!error.response) {
                window.location.href = '/error';
                return;
            }
            
            console.error("Login Error:", error.response?.data);
            const errorMessage = error.response?.data?.error || "Login failed.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            {/* Deep, Subtle Moody Orbs */}
            <div className="floating-orb" style={{ width: 600, height: 600, background: '#4f46e5', top: '-20%', left: '-10%', animation: 'float 12s ease-in-out infinite alternate' }} />
            <div className="floating-orb" style={{ width: 500, height: 500, background: '#f97316', bottom: '-10%', right: '-10%', animation: 'float 10s ease-in-out 2s infinite alternate' }} />

            <div className="auth-content-wrapper">
                {/* Logo Section */}
                <Link to="/" className="auth-logo-section">
                    <div className="auth-logo-icon">
                        <Camera size={28} />
                    </div>
                    <h1 className="auth-logo-text">CLICKSY</h1>
                    <p className="auth-logo-subtext">Capture. Share. Inspire.</p>
                </Link>

                {/* Main Glass Card */}
                <div className="auth-glass-card">
                    
                    {successMsg && (
                        <div className="auth-success-msg">
                            {successMsg}
                        </div>
                    )}

                    {/* Unified Pill Tabs */}
                    <div className="auth-tabs-container">
                        <button 
                            className={`auth-tab-btn ${activeTab === 'signin' ? 'active signin' : ''}`}
                            onClick={() => { setActiveTab('signin'); setSuccessMsg(''); setShowPassword(false); }}
                        >
                            Sign In
                        </button>
                        <button 
                            className={`auth-tab-btn ${activeTab === 'signup' ? 'active signup' : ''}`}
                            onClick={() => { setActiveTab('signup'); setSuccessMsg(''); setShowPassword(false); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* SIGN IN FORM */}
                    {activeTab === 'signin' && (
                        <div className="signin-theme">
                            <h2 className="auth-header-title">Welcome back</h2>
                            <p className="auth-header-desc">Sign in to continue your creative journey</p>
                            
                            <form onSubmit={handleSignIn}>
                                <div className="auth-form-group">
                                    <label htmlFor="signin-email" className="auth-label">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <input id="signin-email" name="signin-email" type="email" placeholder="you@example.com" required className="auth-input" />
                                        <Mail className="auth-input-icon" />
                                    </div>
                                </div>
                                
                                <div className="auth-form-group">
                                    <label htmlFor="signin-password" className="auth-label">Password</label>
                                    <div className="auth-input-wrapper">
                                        <input id="signin-password" name="signin-password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="auth-input" />
                                        <Lock className="auth-input-icon" />
                                        <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <button type="button" className="auth-forgot-password">Forgot password?</button>
                                
                                <button type="submit" disabled={loading} className="auth-submit-btn btn-signin">
                                    {loading ? <div className="spinner" /> : <>Sign In <ArrowRight size={16} /></>}
                                </button>
                            </form>

                            <div className="auth-footer">
                                Read our <Link to="/terms-and-conditions" className="auth-link">Terms of Service</Link> and <Link to="/privacy-policy" className="auth-link">Privacy Policy</Link>
                            </div>
                        </div>
                    )}

                    {/* SIGN UP FORM */}
                    {activeTab === 'signup' && (
                        <div className="signup-theme">
                            <h2 className="auth-header-title">Create account</h2>
                            <p className="auth-header-desc">Join thousands of creators on CLICKSY</p>
                            
                            <form onSubmit={handleSignUp}>
                                <div className="auth-form-group">
                                    <label htmlFor="full-name" className="auth-label">Full Name</label>
                                    <div className="auth-input-wrapper">
                                        <input id="full-name" name="full-name" type="text" placeholder="John Doe" required className="auth-input" />
                                        <User className="auth-input-icon" />
                                    </div>
                                </div>

                                <div className="auth-form-group">
                                    <label htmlFor="signup-email" className="auth-label">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <input id="signup-email" name="signup-email" type="email" placeholder="you@example.com" required className="auth-input" />
                                        <Mail className="auth-input-icon" />
                                    </div>
                                </div>

                                <div className="auth-form-group">
                                    <label htmlFor="user-type" className="auth-label">Account Type</label>
                                    <div className="auth-input-wrapper">
                                        <select id="user-type" name="user-type" required defaultValue="client" className="auth-input">
                                            <option value="client">Client</option>
                                            <option value="photographer">Photographer</option>
                                        </select>
                                        <Briefcase className="auth-input-icon" />
                                        <ChevronDown size={16} className="auth-password-toggle" style={{ pointerEvents: 'none' }} />
                                    </div>
                                </div>
                                
                                <div className="auth-form-group">
                                    <label htmlFor="signup-password" className="auth-label">Password</label>
                                    <div className="auth-input-wrapper">
                                        <input id="signup-password" name="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" required minLength={6} className="auth-input" />
                                        <Lock className="auth-input-icon" />
                                        <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <span className="auth-password-hint">Minimum 6 characters</span>
                                </div>
                                
                                {/* Legal Checkbox - Custom Styled */}
                                <div className="auth-form-group">
                                    <label className="checkbox-label-container">
                                        <input
                                            type="checkbox"
                                            className="hidden-checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            required
                                        />
                                        <span className="custom-checkbox-box"></span>
                                        <span className="label-text">
                                            I agree to the <Link to="/terms-and-conditions" className="auth-link">Terms of Service</Link> and <Link to="/privacy-policy" className="auth-link">Privacy Policy</Link>
                                        </span>
                                    </label>
                                </div>
                                
                                {/* Button is disabled if terms are not agreed to */}
                                <button type="submit" disabled={loading || !agreedToTerms} className="auth-submit-btn btn-signup">
                                    {loading ? <div className="spinner" /> : <>Create Account <ArrowRight size={16} /></>}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <Link to="/" className="auth-back-home">
                    ← Back to home
                </Link>
            </div>
        </div>
    );
};

export default Auth;