import React from 'react';
import AuthForm from '../components/AuthForm';

function LoginPage() {
    return (
        <div className="auth-page">
            <header>
                <h2>Client/Photographer Login</h2>
            </header>
            <AuthForm type="login" />
            <p className="auth-switch">
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
}

export default LoginPage;