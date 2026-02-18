const API_URL = "https://nerdwire-backend.onrender.com";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function signup(email, password, username) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username })
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json();
}
