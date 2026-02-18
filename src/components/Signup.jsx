import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/signup.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (tag.length < 3 || tag.length > 13) {
      setError("Tag must be 3–13 characters");
      return;
    }

    try {
      await signup({ email, username, tag, password });
      navigate("/login");
    } catch (err) {
      setError("Signup failed — email or username may already be taken");
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <div className="signup-title">Create an account</div>

        {error && <p className="signup-error">{error}</p>}

        <div className="signup-field">
          <label className="signup-label">Email</label>
          <input
            className="signup-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">Username</label>
          <input
            className="signup-input"
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">Tag</label>
          <input
            className="signup-input"
            type="text"
            placeholder="3–13 characters"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">Password</label>
          <input
            className="signup-input"
            type="password"
            placeholder="•••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="signup-button" type="submit">
          Continue
        </button>

        <div className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}
