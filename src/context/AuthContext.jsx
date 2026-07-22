import { createContext, useContext, useMemo, useState } from "react";
import { clearSession, getStoredUser, getToken, login as loginRequest } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);
    try {
      const result = await loginRequest(email, password);
      setUser(result.user);
      setToken(result.token);
      return result.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearSession();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    hasRole: (...roles) => Boolean(user && roles.includes(user.role)),
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
