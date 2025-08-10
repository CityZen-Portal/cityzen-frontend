import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    userName: null,
    email: null,
    role: null,
    id: null,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      const email = localStorage.getItem("email");
      const roleRaw = localStorage.getItem("role");
      const id = localStorage.getItem("id");
      
      // Remove any lowercase username keys if they exist
      localStorage.removeItem("username");
      
      if (token && roleRaw && email) {
        let parsedRole;
        try {
          parsedRole = JSON.parse(roleRaw);
        } catch {
          parsedRole = roleRaw;
        }
        setUser({
          token,
          userName,
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

  const login = ({ token, userName, email, role, id }) => {
    // Remove any lowercase username keys if they exist
    localStorage.removeItem("username");
    
    setUser({ token, userName, email, role, id });
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("email", email);
    localStorage.setItem("role", JSON.stringify(role));
    localStorage.setItem("id", id);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setReady(true);
  };

  const logout = () => {
    setUser({
      token: null,
      userName: null,
      email: null,
      role: null,
      id: null,
    });
    // Remove all keys including any lowercase username
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("username"); // Ensure lowercase is removed too
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    delete axios.defaults.headers.common["Authorization"];
    setReady(true);
  };

  return (
    <UserContext.Provider value={{ ...user, login, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);