import { useState } from "react";

export function useAuth() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [email, setEmail] = useState(localStorage.getItem("email"));

  function saveSession({ token, role, email }) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    setRole(role);
    setEmail(email);
  }

  function logout() {
    localStorage.clear();
    setRole(null);
    setEmail(null);
  }

  return { role, email, saveSession, logout };
}
