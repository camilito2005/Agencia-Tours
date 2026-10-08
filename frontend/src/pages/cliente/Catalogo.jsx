import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Hotel, Calendar, UtensilsCrossed, MapPin } from "lucide-react";
import api from "../../api/axios";
import NavBar from "../../components/NavBar";
import { money } from "../../styles/theme";

export default function Catalogo() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filtroPais, setFiltroPais] = useState("");
  const [orden, setOrden] = useState("recientes");

  useEffect(() => {
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
    <div className="page">
      <NavBar />
      <div className="container">
        <h1 className="title-page">Paquetes disponibles</h1>
        <p className="subtitle">
          {cargando ? "Cargando..." : `${toursFiltrados.length} de ${tours.length} tours`}
        </p>

        <div className="flex flex-gap-2 flex-wrap mb-3">
          <select className="filter-select" value={filtroPais} onChange={(e) => setFiltroPais(e.target.value)}>
            <option value="">Todos los países</option>
            {paises.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="filter-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="duracion">Duración: más corto primero</option>
          </select>
        </div>

        {errorMsg && <p className="notice-box">{errorMsg}</p>}
        {!cargando && !errorMsg && toursFiltrados.length === 0 && (
          <p className="text-sub">No hay tours que coincidan con ese filtro.</p>
        )}

        <div className="tour-list">
          {toursFiltrados.map((t) => <TourCard key={t.id_tour} tour={t} />)}
        </div>
      </div>
    </div>
  );
}

function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.id_tour}`} className="tour-card">
      <div className="tour-card-info">
        <div className="tour-card-location"><MapPin size={12} /> {tour.destino?.ciudad}, {tour.destino?.pais}</div>
        <div className="tour-card-name">{tour.nombre_tour}</div>
        <div className="tour-card-meta">
          {tour.hotel?.nombre && <span className="tour-card-meta-item"><Hotel size={13} /> {tour.hotel.nombre}</span>}
          <span className="tour-card-meta-item"><Calendar size={13} /> {tour.duracion} noches</span>
          {tour.alimentacion && <span className="tour-card-meta-item"><UtensilsCrossed size={13} /> {tour.alimentacion}</span>}
        </div>
      </div>
      <div className="tour-card-price">
        <div>
          <div className="tour-card-price-label">Desde</div>
          <div className="tour-card-price-value">{money(tour.precio)}</div>
        </div>
        <div className="tour-card-cupos">{tour.cupos} cupos</div>
      </div>
    </Link>
  );
}
