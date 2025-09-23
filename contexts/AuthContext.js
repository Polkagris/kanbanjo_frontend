import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  roles: [],
  user: null,
  loading: true,
  refreshUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const userInfoUrl = "http://localhost:8080/api/user/me";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRoles = localStorage.getItem("roles");
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUserId = localStorage.getItem("id");

    if (storedUser && storedRoles && storedAuth === "true" && storedUserId) {
      setUser(JSON.parse(storedUser));
      setRoles(JSON.parse(storedRoles));
      setIsAuthenticated(true);
    }

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(userInfoUrl, { credentials: "include" });

      if (response.ok) {
        const data = await response.json();

        setUser(data.username);
        setRoles(data.roles);
        setIsAuthenticated(true);

        // update local storage
        localStorage.setItem("user", JSON.stringify(data.username));
        localStorage.setItem("roles", JSON.stringify(data.roles));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", JSON.stringify(data.id));
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Error with retrieving user info");
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setRoles([]);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("id");
  };

  return (
    <AuthContext.Provider
      value={{ user, roles, isAuthenticated, loading, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
