import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles: array de nombres ("cliente" | "operador" | "administrador")
export default function ProtectedRoute({ roles, children }) {
  const { usuario, rolNombre, cargando } = useAuth();

  if (cargando) return null; // podría ser un spinner
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(rolNombre)) return <Navigate to="/" replace />;

  return children;
}
