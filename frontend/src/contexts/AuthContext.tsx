import { useState, useEffect } from "react";
import type { ReactNode, FC } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, type User } from "./context";

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app startup
    const checkToken = async () => {
      const token = localStorage.getItem("disney_token");
      if (token) {
        try {
          // Handle demo token differently from real JWT
          if (token === "mock-jwt-token") {
            // For demo mode, get user from localStorage
            const demoUser = localStorage.getItem("disney_demo_user");
            if (demoUser) {
              setUser(JSON.parse(demoUser));
            }
          } else {
            // Handle real JWT token
            const decoded = jwtDecode<User & { exp: number }>(token);
            if (decoded.exp * 1000 > Date.now()) {
              setUser({
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
              });
            } else {
              localStorage.removeItem("disney_token");
              localStorage.removeItem("disney_demo_user");
            }
          }
        } catch {
          // Clear invalid tokens
          localStorage.removeItem("disney_token");
          localStorage.removeItem("disney_demo_user");
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 Login attempt started:", { email, password: "***" });

    // Validate input first
    if (!email || !password) {
      console.log("❌ Login failed: Missing email or password");
      return false;
    }   
    try {
      console.log("🌐 Attempting backend API call...");

      // Try to connect to backend API first - Fixed URL
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        console.log("✅ Backend login successful");
        localStorage.setItem("disney_token", token);
        setUser(userData);
        return true;
      } else if (response.status === 404) {
        // Backend API endpoint doesn't exist - use demo mode
        console.log("🔄 Backend API not found (404), switching to demo mode");

        // Create demo user with realistic data
        const mockUser: User = {
          id: "1",
          email: email,
          name: email.split("@")[0] || "Demo User",
        };

        console.log("👤 Creating demo user:", mockUser);

        // Store demo token and user data separately
        localStorage.setItem("disney_token", "mock-jwt-token");
        localStorage.setItem("disney_demo_user", JSON.stringify(mockUser));
        setUser(mockUser);

        console.log("✅ Demo login successful");
        return true;
      } else {
        console.log("❌ Backend login failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.log("🔄 Network error, switching to demo mode:", error);

      // Create demo user with realistic data
      const mockUser: User = {
        id: "1",
        email: email,
        name: email.split("@")[0] || "Demo User",
      };

      console.log("👤 Creating demo user:", mockUser);

      // Store demo token and user data separately
      localStorage.setItem("disney_token", "mock-jwt-token");
      localStorage.setItem("disney_demo_user", JSON.stringify(mockUser));
      setUser(mockUser);

      console.log("✅ Demo login successful");
      return true;
    }
  };

  const logout = () => {
    console.log("👋 Logging out user");
    localStorage.removeItem("disney_token");
    localStorage.removeItem("disney_demo_user");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
