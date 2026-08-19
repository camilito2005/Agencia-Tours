import React, { useEffect, useState } from "react";
import { Hotel, Calendar, UtensilsCrossed, Plane } from "lucide-react";
import api from "../../api/axios";
import NavBar from "../../components/NavBar";
import { COLORS, money } from "../../styles/theme";

export default function Catalogo() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Nota: el endpoint real de tours (GET /api/tours) todavía no está
    // construido en el backend — ese es el siguiente paso. Esta vista ya
    // queda lista para consumirlo en cuanto exista.
    api
      .get("/tours")
      .then((res) => setTours(res.data))
      .catch(() => setErrorMsg("Aún no hay endpoint de tours en el backend, o no responde."))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px 60px" }}>
        <h1 style={{ color: COLORS.navy, fontSize: 24, marginBottom: 4 }}>Paquetes disponibles</h1>
        <p style={{ color: COLORS.sub, fontSize: 14, marginBottom: 20 }}>
          {cargando ? "Cargando..." : `${tours.length} tours publicados`}
        </p>

        {errorMsg && <p style={{ color: COLORS.sub, fontSize: 13, background: "#fff", border: `1px dashed ${COLORS.line}`, padding: 14, borderRadius: 8 }}>{errorMsg}</p>}

        <div style={{ display: "grid", gap: 14 }}>
          {tours.map((t) => (
            <div key={t.id_tour} style={{ display: "flex", background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ flex: 1, padding: "16px 18px" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>{t.pais}</div>
                <div style={{ fontSize: 13, color: COLORS.sub, marginBottom: 10 }}>{t.descripcion}</div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Hotel size={13} /> {t.hotel}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> {t.duracion} noches</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><UtensilsCrossed size={13} /> {t.comidas}</span>
                </div>
              </div>
              <div style={{ width: 140, background: COLORS.navy, color: "#fff", padding: 16 }}>
                <div style={{ fontSize: 10, color: "#B9C2D6" }}>Desde</div>
                <div style={{ fontSize: 16 }}>{money(t.precio)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
