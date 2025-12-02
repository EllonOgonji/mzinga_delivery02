import { useState, useEffect } from "react";

export type User = { id?: string; role?: string; [k: string]: any };

export default function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || user?.role || null;

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("user") || "null"); setUser(u); } catch {}
  }, []);

  const login = (u: User, t?: string) => {
    if (t) localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    if (u.role) localStorage.setItem("role", u.role);
    setUser(u);
  };
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); localStorage.removeItem("role"); setUser(null); };

  return { user, role, token, isAuthenticated: Boolean(token), login, logout };
}