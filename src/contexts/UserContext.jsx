// contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    role: null,
    token: null,
    id: null,
    username: null,
  });

  useEffect(() => {
    // Load from localStorage on first load
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const role = JSON.parse(localStorage.getItem("role"));
    const id = localStorage.getItem("id");

    if (token && role && email) {
      setUser({ token, email, username, role, id });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("role", JSON.stringify(userData.role));
    localStorage.setItem("id", userData.id);
  };

  const logout = () => {
    setUser({ email: null, role: null, token: null, id: null, username: null });
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use context
export const useUser = () => useContext(UserContext);
