"use client";

import { useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AuthContext, { type AuthContextType } from "./auth-context";
import { JwtPayload } from "@/types/usuario_types";

const NOW = Math.floor(Date.now() / 1000);

export const AuthProvider = ({
  children,
  initialToken,
  initialUser,
}: {
  children: ReactNode;
  initialToken?: string | null;
  initialUser?: JwtPayload | null;
}) => {

  // 🔹 Lee cookie una sola vez al inicio (sin efecto)
  const initAuth = () => {
    if (initialToken && initialUser)
      return { token: initialToken, user: initialUser };

    const stored = Cookies.get("auth_token");
    if (!stored) return { token: null, user: null };

    try {
      const decoded = jwtDecode<JwtPayload>(stored);

      if (decoded.exp < NOW / 1000) {
        Cookies.remove("auth_token");
        return { token: null, user: null };
      }


      return { token: stored, user: decoded };
    } catch {
      Cookies.remove("auth_token");
      return { token: null, user: null };
    }
  };

  const { token: initToken, user: initUser } = initAuth();
  const [token, setToken] = useState(initToken);
  const [usuario, setUsuario] = useState(initUser);

  const login = (newToken: string) => {
    Cookies.set("auth_token", newToken, { expires: 1, sameSite: "Strict" });
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
    setUsuario(jwtDecode<JwtPayload>(newToken));
  };

  const logout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("auth_token");
    setToken(null);
    setUsuario(null);
    console.log("Logout");
  };

  const value: AuthContextType = {
    token,
    usuario,
    login,
    logout,
    isAuthenticated: !!token && !!usuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
