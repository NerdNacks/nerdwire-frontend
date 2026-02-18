import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, signup as apiSignup } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Load user from token on refresh
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: decoded.id,
          username: decoded.username,
          tag: decoded.tag,
          avatar: decoded.avatar || ""
        });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setToken(null);
      }

      setLoading(false);
    }

    loadUser();
  }, [token]);

  // LOGIN
  async function login(email, password) {
    const data = await apiLogin(email, password);

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  }

  // SIGNUP
  async function signup(email, password, username) {
    const data = await apiSignup(email, password, username);

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  }

  // LOGOUT
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
