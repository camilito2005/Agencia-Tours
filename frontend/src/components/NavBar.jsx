import React from "react";
import { Plane, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/theme";

export default function NavBar() {
  const { usuario, rolNombre, logout } = useAuth();
  const etiquetas = { cliente: "Cliente", operador: "Operador", administrador: "Administrador" };

  return (
    <div style={{ background: COLORS.navy, color: "#fff" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Plane size={18} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>Rutas del Mundo</span>
        </div>
        {usuario && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13 }}>{usuario.nombre}</div>
              <div style={{ fontSize: 11, color: "#B9C2D6" }}>{etiquetas[rolNombre]}</div>
            </div>
            <button onClick={logout} style={{ background: "none", border: "1px solid #fff", color: "#fff", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <LogOut size={14} /> Salir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
