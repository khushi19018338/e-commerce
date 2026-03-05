import { createContext, useState, useEffect } from "react";
import { getProfile } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data.user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}