import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  // Defaulting to customer for initial load, can be swapped later
  const [role, setRoleState] = useState("customer");
  const [activeTab, setActiveTab] = useState("Home");

  const setRole = (newRole) => {
    setRoleState(newRole);
    // Reset activeTab to defaults per role
    if (newRole === "customer") {
      setActiveTab("Home");
    } else if (newRole === "driver") {
      setActiveTab("Jobs");
    } else if (newRole === "staff") {
      setActiveTab("Kitchen");
    } else if (newRole === "admin") {
      setActiveTab("Dashboard");
    }
  };

  return (
    <AuthContext.Provider value={{ role, setRole, activeTab, setActiveTab }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
