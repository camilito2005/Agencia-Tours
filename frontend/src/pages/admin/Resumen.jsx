import React from "react";
import NavBar from "../../components/NavBar";
import { COLORS } from "../../styles/theme";

export default function Resumen() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px" }}>
        <h1 style={{ color: COLORS.navy }}>Panel de administrador</h1>
        <p style={{ color: COLORS.sub, fontSize: 14 }}>
          Aquí van: resumen general, gestión de tours, usuarios (con creación de operadores/admins) y notificaciones de compra.
        </p>
      </div>
    </div>
  );
}
