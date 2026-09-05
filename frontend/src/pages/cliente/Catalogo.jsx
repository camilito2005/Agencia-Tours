import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Hotel, Calendar, UtensilsCrossed, MapPin, Search } from "lucide-react";
import api from "../../api/axios";
import NavBar from "../../components/NavBar";
import { COLORS, money } from "../../styles/theme";

export default function Catalogo() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filtroPais, setFiltroPais] = useState("");
  const [orden, setOrden] = useState("recientes");

  useEffect(() => {
    // GET /api/tours (pendiente de construir en el backend) debe devolver
    // cada tour con su destino y hotel ya incluidos (join), así:
    // { id_tour, nombre_tour, precio, moneda, duracion, alimentacion,
    //   imagen_url, cupos, destino: { pais, ciudad }, hotel: { nombre } }
    api
      .get("/tours")
      .then((res) => setTours(res.data))
      .catch(() => setErrorMsg("Aún no hay endpoint de tours en el backend, o no responde."))
      .finally(() => setCargando(false));
  }, []);

  const paises = useMemo(() => {
    const set = new Set(tours.map((t) => t.destino?.pais).filter(Boolean));
    return Array.from(set).sort();
  }, [tours]);

  const toursFiltrados = useMemo(() => {
    let lista = tours.filter((t) => !filtroPais || t.destino?.pais === filtroPais);
    if (orden === "precio_asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "precio_desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
    if (orden === "duracion") lista = [...lista].sort((a, b) => a.duracion - b.duracion);
    return lista;
  }, [tours, filtroPais, orden]);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px 60px" }}>
        <h1 style={{ color: COLORS.navy, fontSize: 24, marginBottom: 4 }}>Paquetes disponibles</h1>
        <p style={{ color: COLORS.sub, fontSize: 14, marginBottom: 20 }}>
          {cargando ? "Cargando..." : `${toursFiltrados.length} de ${tours.length} tours`}
        </p>

        {/* Filtros básicos: país, orden por precio/duración */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <select value={filtroPais} onChange={(e) => setFiltroPais(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.line}`, background: "#fff", fontSize: 13 }}>
            <option value="">Todos los países</option>
            {paises.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={orden} onChange={(e) => setOrden(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.line}`, background: "#fff", fontSize: 13 }}>
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="duracion">Duración: más corto primero</option>
          </select>
        </div>

        {errorMsg && (
          <p style={{ color: COLORS.sub, fontSize: 13, background: "#fff", border: `1px dashed ${COLORS.line}`, padding: 14, borderRadius: 8 }}>
            {errorMsg}
          </p>
        )}

        {!cargando && !errorMsg && toursFiltrados.length === 0 && (
          <p style={{ color: COLORS.sub, fontSize: 14 }}>No hay tours que coincidan con ese filtro.</p>
        )}

        <div style={{ display: "grid", gap: 14 }}>
          {toursFiltrados.map((t) => <TourCard key={t.id_tour} tour={t} />)}
        </div>
      </div>
    </div>
  );
}

function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.id_tour}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ display: "flex", background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, overflow: "hidden", transition: "border-color .15s" }}>
        <div style={{ flex: 1, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.sub, marginBottom: 4 }}>
            <MapPin size={12} /> {tour.destino?.ciudad}, {tour.destino?.pais}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.navy }}>{tour.nombre_tour}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, marginTop: 10, color: COLORS.ink, flexWrap: "wrap" }}>
            {tour.hotel?.nombre && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Hotel size={13} /> {tour.hotel.nombre}</span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> {tour.duracion} noches</span>
            {tour.alimentacion && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><UtensilsCrossed size={13} /> {tour.alimentacion}</span>
            )}
          </div>
        </div>
        <div style={{ width: 150, background: COLORS.navy, color: "#fff", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "#AEB9CF" }}>Desde</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.gold }}>{money(tour.precio)}</div>
          </div>
          <div style={{ fontSize: 11, color: "#AEB9CF" }}>{tour.cupos} cupos</div>
        </div>
      </div>
    </Link>
  );
}
