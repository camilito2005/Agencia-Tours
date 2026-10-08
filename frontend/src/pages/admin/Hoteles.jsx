import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Hotel as HotelIcon } from "lucide-react";
import NavBar from "../../components/NavBar";
import hotelesService from "../../api/hotelesService";
import { COLORS } from "../../styles/theme";

const formVacio = { nombre: "", pais: "", ciudad: "", categoria: "", descripcion: "", servicios: "", imagen_url: "" };

export default function Hoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState(formVacio);
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    setCargando(true);
    hotelesService
      .listar()
      .then(setHoteles)
      .catch(() => setErrorMsg("No se pudieron cargar los hoteles."))
      .finally(() => setCargando(false));
  }

  useEffect(cargar, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function crear(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorMsg("");
    try {
      await hotelesService.crear(form);
      setForm(formVacio);
      cargar();
    } catch (err) {
      setErrorMsg(err.response?.data?.modal?.message || "No se pudo crear el hotel.");
    } finally {
      setGuardando(false);
    }
  }

  const campo = { width: "100%", padding: 9, marginTop: 4, border: `1px solid ${COLORS.line}`, borderRadius: 6, boxSizing: "border-box", fontSize: 14 };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 60px" }}>
        <Link to="/admin" style={{ color: COLORS.navy, fontSize: 14, textDecoration: "none" }}>&larr; Panel de administrador</Link>
        <h1 style={{ color: COLORS.navy, fontSize: 24, margin: "12px 0 20px" }}>Hoteles</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
          {/* Lista */}
          <div>
            {cargando && <p style={{ color: COLORS.sub, fontSize: 14 }}>Cargando...</p>}
            {!cargando && hoteles.length === 0 && (
              <p style={{ color: COLORS.sub, fontSize: 14, border: `1px dashed ${COLORS.line}`, borderRadius: 8, padding: 20, textAlign: "center" }}>
                Aún no has creado ningún hotel. Empieza con el formulario de la derecha.
              </p>
            )}
            <div style={{ display: "grid", gap: 10 }}>
              {hoteles.map((h) => (
                <div key={h.id_hotel} style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <HotelIcon size={16} color={COLORS.gold} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{h.nombre} {h.categoria && `· ${h.categoria}`}</div>
                    <div style={{ fontSize: 12, color: COLORS.sub }}>{h.ciudad}, {h.pais}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.sub }}>ID: {h.id_hotel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={crear} style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 18, position: "sticky", top: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12, color: COLORS.navy }}>Nuevo hotel</h3>

            <label style={{ fontSize: 12, color: COLORS.sub }}>Nombre *</label>
            <input style={campo} value={form.nombre} onChange={set("nombre")} required />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.sub }}>País *</label>
                <input style={campo} value={form.pais} onChange={set("pais")} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.sub }}>Ciudad *</label>
                <input style={campo} value={form.ciudad} onChange={set("ciudad")} required />
              </div>
            </div>

            <label style={{ fontSize: 12, color: COLORS.sub, display: "block", marginTop: 10 }}>Categoría</label>
            <input style={campo} value={form.categoria} onChange={set("categoria")} placeholder="Ej. 4 estrellas, Boutique" />

            <label style={{ fontSize: 12, color: COLORS.sub, display: "block", marginTop: 10 }}>Descripción</label>
            <textarea style={{ ...campo, minHeight: 50 }} value={form.descripcion} onChange={set("descripcion")} />

            <label style={{ fontSize: 12, color: COLORS.sub, display: "block", marginTop: 10 }}>Servicios</label>
            <input style={campo} value={form.servicios} onChange={set("servicios")} placeholder="Piscina, wifi, desayuno..." />

            <label style={{ fontSize: 12, color: COLORS.sub, display: "block", marginTop: 10 }}>URL de imagen</label>
            <input style={campo} value={form.imagen_url} onChange={set("imagen_url")} placeholder="https://..." />

            {errorMsg && <p style={{ color: "#B91C1C", fontSize: 12, marginTop: 10 }}>{errorMsg}</p>}

            <button type="submit" disabled={guardando}
              style={{ width: "100%", marginTop: 14, padding: 10, background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 6, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
              <Plus size={15} /> {guardando ? "Guardando..." : "Crear hotel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
