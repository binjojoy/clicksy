import { useState } from "react"
//import Link from "next/link"
import { Link } from "react-router-dom"
import "../styles.css"

export default function RegisterPages() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">CLICKSY</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="form-submit">
            Sign In
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link href="/signup">Create one</Link>
        </div>
      </div>
    </div>
  )
}
