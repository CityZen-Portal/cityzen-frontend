import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    username: null,
    email: null,
    role: null,
    id: null,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const roleRaw = localStorage.getItem("role");
      const id = localStorage.getItem("id");

      if (token && roleRaw && email) {
        let parsedRole;
        try {
          parsedRole = JSON.parse(roleRaw);
        } catch {
          parsedRole = roleRaw;
        }

        setUser({
          token,
          username,
          email,
          role: parsedRole,
          id,
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // ignore hydration errors
    } finally {
      setReady(true);
    }
  }, []);

  const login = ({ token, username, email, role, id }) => {
    setUser({ token, username, email, role, id });
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("role", JSON.stringify(role));
    localStorage.setItem("id", id);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setReady(true);
  };

  const logout = () => {
    // Reset state
    setUser({
      token: null,
      username: null,
      email: null,
      role: null,
      id: null,
    });

    // Clear only auth-related items
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("id");

    // If you want to wipe all localStorage (uncomment next line)
    // localStorage.clear();

    // Remove default Authorization header
    delete axios.defaults.headers.common["Authorization"];

    // UI can react instantly
    setReady(true);
  };

  return (
    <UserContext.Provider value={{ ...user, login, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
