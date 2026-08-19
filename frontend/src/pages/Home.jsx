import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Camera, Users, ShieldCheck, MapPin, Phone } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { COLORS, waLink } from "../styles/theme";

const ADMIN_WHATSAPP = "573000000000"; // reemplaza por el número real de contacto

export default function Home() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: COLORS.ink, background: COLORS.bg }}>
      {/* NAV */}
      <div style={{ background: COLORS.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo} alt="R&G Travel" style={{ height: 42, width: 42, borderRadius: 8, objectFit: "cover" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>R&amp;G TRAVEL</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none", padding: "9px 16px", fontSize: 14, fontWeight: 600, border: `1px solid ${COLORS.gold}`, borderRadius: 6 }}>
              Iniciar sesión
            </Link>
            <Link to="/registro" style={{ color: COLORS.navyDark, textDecoration: "none", padding: "9px 16px", fontSize: 14, fontWeight: 600, background: COLORS.gold, borderRadius: 6 }}>
              Regístrate
            </Link>
          </div>
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
              Vive el mundo con la tranquilidad de viajar acompañado.
            </h1>
            <p style={{ fontSize: 16, color: "#C7CEDD", lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
              En R&amp;G Travel diseñamos paquetes internacionales completos — hotel, comidas y
              todos los detalles resueltos — para que solo te preocupes por disfrutar.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/registro" style={{ background: COLORS.gold, color: COLORS.navyDark, textDecoration: "none", padding: "13px 22px", borderRadius: 6, fontWeight: 700, fontSize: 15 }}>
                Explorar paquetes
              </Link>
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
