import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};

type AuthContextType = {
  isAuthenticated: boolean;
  roles: Role[];
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  roles: [],
  user: null,
  loading: true,
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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
      const response = await fetch(userInfoUrl, {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("fetch user data from authContext", data);

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
    localStorage.removeItem("userId");
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
