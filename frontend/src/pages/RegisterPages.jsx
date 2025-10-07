import React from 'react';
import AuthForm from '../components/AuthForm';

function RegisterPages() {
    return (
        <div className="auth-page">
            <header>
                <h2>Join CLICKSY</h2>
            </header>
            <AuthForm type="register" />
            <p className="auth-switch">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}

export default RegisterPages;