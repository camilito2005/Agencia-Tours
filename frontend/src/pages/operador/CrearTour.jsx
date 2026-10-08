import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import destinosService from "../../api/destinosService";
import hotelesService from "../../api/hotelesService";
import toursService from "../../api/toursService";
import { COLORS } from "../../styles/theme";

const formVacio = {
  nombre_tour: "", id_destino: "", id_hotel: "", descripcion: "", precio: "",
  duracion: 5, cupos: 10, alimentacion: "Desayuno incluido", transporte: "",
  fecha_salida: "", fecha_regreso: "", incluye: "", no_incluye: "", itinerario: "",
};

export default function CrearTour() {
  const navigate = useNavigate();
  const [destinos, setDestinos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [errorMsg, setErrorMsg] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    destinosService.listar().then(setDestinos).catch(() => {});
    hotelesService.listar().then(setHoteles).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function crear(e) {
    e.preventDefault();
    if (!form.id_destino) {
      setErrorMsg("Selecciona un destino. Si no hay ninguno en la lista, pídele al admin que cree uno primero.");
      return;
    }
    setGuardando(true);
    setErrorMsg("");
    try {
      await toursService.crear({ ...form, id_hotel: form.id_hotel || null });
      navigate("/operador");
    } catch (err) {
      setErrorMsg(err.response?.data?.modal?.message || "No se pudo crear el tour.");
    } finally {
      setGuardando(false);
    }
  }

  const campo = { width: "100%", padding: 9, marginTop: 4, border: `1px solid ${COLORS.line}`, borderRadius: 6, boxSizing: "border-box", fontSize: 14 };
  const label = { fontSize: 12, color: COLORS.sub, display: "block", marginTop: 10 };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 24px 60px" }}>
        <Link to="/operador" style={{ color: COLORS.navy, fontSize: 14, textDecoration: "none" }}>&larr; Mis tours</Link>
        <h1 style={{ color: COLORS.navy, fontSize: 24, margin: "12px 0 20px" }}>Crear tour</h1>

        {destinos.length === 0 && (
          <p style={{ background: "#fff", border: `1px dashed ${COLORS.line}`, borderRadius: 8, padding: 14, fontSize: 13, color: COLORS.sub, marginBottom: 16 }}>
            Todavía no hay destinos cargados. Pídele al administrador que cree al menos uno en su panel.
          </p>
        )}

        <form onSubmit={crear} style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 20 }}>
          <label style={{ fontSize: 12, color: COLORS.sub }}>Nombre del tour *</label>
          <input style={campo} value={form.nombre_tour} onChange={set("nombre_tour")} required />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={label}>Destino *</label>
              <select style={campo} value={form.id_destino} onChange={set("id_destino")} required>
                <option value="">Selecciona...</option>
                {destinos.map((d) => <option key={d.id_destino} value={d.id_destino}>{d.ciudad}, {d.pais}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Hotel</label>
              <select style={campo} value={form.id_hotel} onChange={set("id_hotel")}>
                <option value="">Sin hotel asignado</option>
                {hoteles.map((h) => <option key={h.id_hotel} value={h.id_hotel}>{h.nombre}</option>)}
              </select>
            </div>
          </div>

          <label style={label}>Descripción</label>
          <textarea style={{ ...campo, minHeight: 60 }} value={form.descripcion} onChange={set("descripcion")} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div>
              <label style={label}>Precio (COP) *</label>
              <input type="number" style={campo} value={form.precio} onChange={set("precio")} required />
            </div>
            <div>
              <label style={label}>Duración (noches) *</label>
              <input type="number" style={campo} value={form.duracion} onChange={set("duracion")} required />
            </div>
            <div>
              <label style={label}>Cupos *</label>
              <input type="number" style={campo} value={form.cupos} onChange={set("cupos")} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={label}>Alimentación</label>
              <select style={campo} value={form.alimentacion} onChange={set("alimentacion")}>
                <option>Sin comidas</option>
                <option>Desayuno incluido</option>
                <option>Media pensión</option>
                <option>Todo incluido</option>
              </select>
            </div>
            <div>
              <label style={label}>Transporte</label>
              <input style={campo} value={form.transporte} onChange={set("transporte")} placeholder="Aéreo, bus..." />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={label}>Fecha de salida</label>
              <input type="date" style={campo} value={form.fecha_salida} onChange={set("fecha_salida")} />
            </div>
            <div>
              <label style={label}>Fecha de regreso</label>
              <input type="date" style={campo} value={form.fecha_regreso} onChange={set("fecha_regreso")} />
            </div>
          </div>

          <label style={label}>Incluye</label>
          <textarea style={{ ...campo, minHeight: 50 }} value={form.incluye} onChange={set("incluye")} />

          <label style={label}>No incluye</label>
          <textarea style={{ ...campo, minHeight: 50 }} value={form.no_incluye} onChange={set("no_incluye")} />

          <label style={label}>Itinerario</label>
          <textarea style={{ ...campo, minHeight: 60 }} value={form.itinerario} onChange={set("itinerario")} />

          {errorMsg && <p style={{ color: "#B91C1C", fontSize: 13, marginTop: 12 }}>{errorMsg}</p>}

          <button type="submit" disabled={guardando}
            style={{ width: "100%", marginTop: 16, padding: 12, background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 6, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
            <Plus size={16} /> {guardando ? "Publicando..." : "Publicar tour"}
          </button>
        </form>
      </div>
    </div>
  );
}
