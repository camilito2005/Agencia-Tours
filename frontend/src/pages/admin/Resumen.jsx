import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Hotel, Package, Users } from "lucide-react";
import NavBar from "../../components/NavBar";
import { COLORS } from "../../styles/theme";

const ACCESOS = [
  { to: "/admin/destinos", icon: <MapPin size={20} />, title: "Destinos", desc: "Países y ciudades disponibles para armar tours." },
  { to: "/admin/hoteles", icon: <Hotel size={20} />, title: "Hoteles", desc: "Hospedajes que se pueden asociar a un tour." },
  { to: "/tours", icon: <Package size={20} />, title: "Tours", desc: "Ver el catálogo publicado (crear/editar viene del panel operador)." },
  { to: "/admin/usuarios", icon: <Users size={20} />, title: "Usuarios", desc: "Clientes, operadores y administradores (próximamente)." },
];

export default function Resumen() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 60px" }}>
        <h1 style={{ color: COLORS.navy, fontSize: 24, marginBottom: 20 }}>Panel de administrador</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {ACCESOS.map((a) => (
            <Link key={a.to} to={a.to} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 18, height: "100%" }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: COLORS.navy, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  {a.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: COLORS.sub }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
