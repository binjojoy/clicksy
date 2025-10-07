import React from 'react';

function HomePage() {
    return (
        <div className="container" style={{padding: '50px 0'}}>
            <h1>Welcome to CLICKSY</h1>
            <p>The one-stop platform for photographers and clients.</p>
            <div style={{marginTop: '20px'}}>
                <a href="/login">Login</a> | <a href="/register">Register</a>
            </div>
        </div>
    );
}

export default HomePage;