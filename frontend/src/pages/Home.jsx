import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Camera, Users, ShieldCheck, MapPin, Phone, ChevronDown, LogOut } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { COLORS, waLink } from "../styles/theme";
import { useAuth } from "../context/AuthContext";

const ADMIN_WHATSAPP = "573000000000"; // reemplaza por el número real de contacto

// Qué opciones ve cada rol en el menú de la página principal
const MENU_POR_ROL = {
  cliente: [{ label: "Ver tours", to: "/tours" }],
  operador: [{ label: "Mis tours", to: "/operador" }],
  administrador: [{ label: "Panel de administrador", to: "/admin" }],
};

export default function Home() {
  const { usuario, rolNombre, cargando, logout } = useAuth();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: COLORS.ink, background: COLORS.bg }}>
      {/* NAV */}
      <div style={{ background: COLORS.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo} alt="R&G Travel" style={{ height: 42, width: 42, borderRadius: 8, objectFit: "cover" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>R&amp;G TRAVEL</span>
          </div>

          {/* Mientras verifica la sesión, no mostramos nada para evitar el parpadeo
              de "Iniciar sesión" -> menú de usuario */}
          {cargando ? null : usuario ? (
            <UserMenu usuario={usuario} rolNombre={rolNombre} logout={logout} />
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <Link to="/login" style={{ color: "#fff", textDecoration: "none", padding: "9px 16px", fontSize: 14, fontWeight: 600, border: `1px solid ${COLORS.gold}`, borderRadius: 6 }}>
                Iniciar sesión
              </Link>
              <Link to="/registro" style={{ color: COLORS.navyDark, textDecoration: "none", padding: "9px 16px", fontSize: 14, fontWeight: 600, background: COLORS.gold, borderRadius: 6 }}>
                Regístrate
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`, color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "70px 24px 90px", display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px" }}>
            <div style={{ color: COLORS.gold, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>
              SERIEDAD &nbsp;•&nbsp; RESPONSABILIDAD &nbsp;•&nbsp; CONFIANZA
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, margin: "0 0 18px" }}>
              {usuario ? `Bienvenido de nuevo, ${usuario.nombre.split(" ")[0]}.` : "Vive el mundo con la tranquilidad de viajar acompañado."}
            </h1>
            <p style={{ fontSize: 16, color: "#C7CEDD", lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
              En R&amp;G Travel diseñamos paquetes internacionales completos — hotel, comidas y
              todos los detalles resueltos — para que solo te preocupes por disfrutar.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {usuario ? (
                <Link to={MENU_POR_ROL[rolNombre]?.[0]?.to || "/"} style={{ background: COLORS.gold, color: COLORS.navyDark, textDecoration: "none", padding: "13px 22px", borderRadius: 6, fontWeight: 700, fontSize: 15 }}>
                  {rolNombre === "cliente" ? "Explorar paquetes" : "Ir a mi panel"}
                </Link>
              ) : (
                <Link to="/registro" style={{ background: COLORS.gold, color: COLORS.navyDark, textDecoration: "none", padding: "13px 22px", borderRadius: 6, fontWeight: 700, fontSize: 15 }}>
                  Explorar paquetes
                </Link>
              )}
              <a href={waLink(ADMIN_WHATSAPP, "Hola, quiero información sobre sus tours.")} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #45527A", color: "#fff", textDecoration: "none", padding: "13px 22px", borderRadius: 6, fontWeight: 600, fontSize: 15 }}>
                <Phone size={16} /> Hablar con un asesor
              </a>
            </div>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
            <img src={logo} alt="R&G Travel" style={{ width: 240, height: 240, borderRadius: 20, objectFit: "cover", boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }} />
          </div>
        </div>
      </div>

      {/* SERVICIOS */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
        <h2 style={{ textAlign: "center", color: COLORS.navy, fontSize: 24, marginBottom: 36 }}>Lo que hacemos por ti</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <ServiceCard icon={<Briefcase size={22} />} title="Viajes" text="Paquetes internacionales completos: vuelos, hotel, comidas y actividades ya organizados." />
          <ServiceCard icon={<Camera size={22} />} title="Turismo" text="Destinos cuidadosamente seleccionados, con itinerarios pensados para aprovechar cada día." />
          <ServiceCard icon={<Users size={22} />} title="Asesoría" text="Un asesor real te acompaña antes, durante y después del viaje — por WhatsApp, cuando lo necesites." />
        </div>
      </div>

      {/* CONFIANZA */}
      <div style={{ background: COLORS.paper, borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px", display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          <TrustPoint icon={<ShieldCheck size={20} />} text="Pagos seguros dentro de la plataforma" />
          <TrustPoint icon={<MapPin size={20} />} text="Operadores especializados por destino" />
          <TrustPoint icon={<Phone size={20} />} text="Comunicación directa por WhatsApp" />
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: COLORS.navyDark, color: "#8FA0C4", padding: "28px 24px", textAlign: "center", fontSize: 13 }}>
        © {new Date().getFullYear()} R&amp;G Travel. Todos los derechos reservados.
      </div>
    </div>
  );
}

// Menú desplegable con las opciones según el rol (cliente/operador/administrador)
function UserMenu({ usuario, rolNombre, logout }) {
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();
  const opciones = MENU_POR_ROL[rolNombre] || [];
  const etiquetas = { cliente: "Cliente", operador: "Operador", administrador: "Administrador" };

  async function salir() {
    await logout();
    setAbierto(false);
    navigate("/");
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setAbierto((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none",
          border: `1px solid ${COLORS.gold}`, color: "#fff", padding: "8px 14px",
          borderRadius: 6, cursor: "pointer", fontSize: 14,
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
          <span style={{ fontWeight: 600 }}>{usuario.nombre}</span>
          <span style={{ fontSize: 11, color: COLORS.gold }}>{etiquetas[rolNombre]}</span>
        </span>
        <ChevronDown size={16} style={{ transform: abierto ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>

      {abierto && (
        <>
          {/* backdrop invisible para cerrar el menú al hacer clic afuera */}
          <div onClick={() => setAbierto(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff",
            borderRadius: 8, boxShadow: "0 12px 30px rgba(0,0,0,0.25)", minWidth: 200,
            overflow: "hidden", zIndex: 20,
          }}>
            {opciones.map((op) => (
              <Link key={op.to} to={op.to} onClick={() => setAbierto(false)}
                style={{ display: "block", padding: "12px 16px", fontSize: 14, color: COLORS.ink, textDecoration: "none", borderBottom: `1px solid ${COLORS.line}` }}>
                {op.label}
              </Link>
            ))}
            <button onClick={salir}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", fontSize: 14, color: "#B91C1C", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <LogOut size={14} /> Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ServiceCard({ icon, title, text }) {
  return (
    <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 24 }}>
      <div style={{ width: 42, height: 42, borderRadius: 8, background: COLORS.navy, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, color: COLORS.sub, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function TrustPoint({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: COLORS.navy, fontWeight: 600 }}>
      <span style={{ color: COLORS.gold }}>{icon}</span> {text}
    </div>
  );
}