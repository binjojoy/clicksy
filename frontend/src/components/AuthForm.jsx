import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // <--- Import our API service

function AuthForm({ type }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'client' // Default user type for registration
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isLogin = type === 'login';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            let endpoint = isLogin ? '/auth/login' : '/auth/register';
            let dataToSend = isLogin 
                ? { email: formData.email, password: formData.password }
                : formData; // Includes userType for registration

            const response = await api.post(endpoint, dataToSend);

            if (response.status === 200 || response.status === 201) {
                console.log(`${isLogin ? 'Login' : 'Registration'} Successful!`, response.data);

                if (isLogin) {
                    // Store user data and token (e.g., in localStorage)
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    // Redirect to dashboard on successful login
                    navigate('/dashboard'); 
                } else {
                    // Registration successful, redirect to login page
                    alert(response.data.message);
                    navigate('/login');
                }
            }
        } catch (err) {
            console.error('API Error:', err.response || err);
            // Handle specific errors from the backend response
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                {/* User Type Select (only for registration) */}
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="userType">I am a...</label>
                        <select 
                            name="userType" 
                            id="userType" 
                            value={formData.userType} 
                            onChange={handleChange} 
                            disabled={loading}
                            required
                        >
                            <option value="client">Client (Looking for a Photographer)</option>
                            <option value="photographer">Photographer (Showcasing Work)</option>
                        </select>
                    </div>
                )}
                
                {/* Email Input */}
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
                
                {/* Password Input */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
                
                {/* Error Display */}
                {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}
                
                {/* Submit Button */}
                <button type="submit" className="form-submit-button" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                </button>
            </form>
        </div>
    );
}

export default AuthForm;