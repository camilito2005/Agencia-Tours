import React from "react";
import NavBar from "../../components/NavBar";
import { COLORS } from "../../styles/theme";

export default function MisTours() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px" }}>
        <h1 style={{ color: COLORS.navy }}>Mis tours</h1>
        <p style={{ color: COLORS.sub, fontSize: 14 }}>
          Aquí listarás los tours creados por este operador, con botón "Crear tour" y clientes asignados.
          Falta conectar al endpoint de tours del backend.
        </p>
      </div>
    </div>
  );
}
