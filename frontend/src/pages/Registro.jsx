import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/theme";

// Solo registra Clientes (cargo: 1, forzado en AuthContext.registrar).
// No hay ningún selector de rol en este formulario.
export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", password: "", comfirm_password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await registrar(form);
      navigate("/tours");
    } catch (err) {
      setError(err.response?.data?.modal?.message || "No se pudo completar el registro.");
    } finally {
      setCargando(false);
    }
  }

  const campo = { width: "100%", padding: 10, marginTop: 4, marginBottom: 14, border: `1px solid ${COLORS.line}`, borderRadius: 6, boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 24 }}>
        <h1 style={{ textAlign: "center", color: COLORS.navy, marginBottom: 20 }}>Crear cuenta</h1>
        <form onSubmit={onSubmit} style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 24 }}>
          <label style={{ fontSize: 12, color: COLORS.sub }}>Nombre completo</label>
          <input value={form.nombre} onChange={set("nombre")} required style={campo} />

          <label style={{ fontSize: 12, color: COLORS.sub }}>Correo</label>
          <input type="email" value={form.email} onChange={set("email")} required style={campo} />

          <label style={{ fontSize: 12, color: COLORS.sub }}>WhatsApp (con indicativo, ej. 573001234567)</label>
          <input value={form.telefono} onChange={set("telefono")} required style={campo} />

          <label style={{ fontSize: 12, color: COLORS.sub }}>Contraseña (mín. 6 caracteres)</label>
          <input type="password" value={form.password} onChange={set("password")} required style={campo} />

          <label style={{ fontSize: 12, color: COLORS.sub }}>Confirmar contraseña</label>
          <input type="password" value={form.comfirm_password} onChange={set("comfirm_password")} required style={campo} />

          {error && <p style={{ color: "#B91C1C", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" disabled={cargando}
            style={{ width: "100%", padding: 12, background: COLORS.coral, color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>
            {cargando ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 14, color: COLORS.sub }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: COLORS.navy }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
