import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. Cek LocalStorage saat aplikasi dibuka (agar tidak logout saat refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Fungsi Login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 3. Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect paksa ke login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook biar gampang dipanggil
export const useAuth = () => useContext(AuthContext);