import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plane } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/theme";

const inicioPorRol = { cliente: "/tours", operador: "/operador", administrador: "/admin" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const usuario = await login(email, password);
      const rolNombre = { 1: "cliente", 2: "operador", 3: "administrador" }[usuario.rol];
      navigate(inicioPorRol[rolNombre] || "/");
    } catch (err) {
      setError(err.response?.data?.modal?.message || "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.navy }}>
            <Plane size={20} />
            <span style={{ fontSize: 22, fontWeight: 700 }}>Rutas del Mundo</span>
          </div>
        </div>
        <form onSubmit={onSubmit} style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 24 }}>
          <label style={{ fontSize: 12, color: COLORS.sub }}>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: "100%", padding: 10, marginTop: 4, marginBottom: 14, border: `1px solid ${COLORS.line}`, borderRadius: 6, boxSizing: "border-box" }} />

          <label style={{ fontSize: 12, color: COLORS.sub }}>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: "100%", padding: 10, marginTop: 4, marginBottom: 14, border: `1px solid ${COLORS.line}`, borderRadius: 6, boxSizing: "border-box" }} />

          {error && <p style={{ color: "#B91C1C", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" disabled={cargando}
            style={{ width: "100%", padding: 12, background: COLORS.coral, color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 14, color: COLORS.sub }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ color: COLORS.navy }}>Regístrate como cliente</Link>
        </p>
      </div>
    </div>
  );
}
