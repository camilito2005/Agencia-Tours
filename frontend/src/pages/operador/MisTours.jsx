import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import NavBar from "../../components/NavBar";
import toursService from "../../api/toursService";
import { COLORS, money } from "../../styles/theme";

export default function MisTours() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    toursService
      .misTours()
      .then(setTours)
      .catch(() => setErrorMsg("No se pudieron cargar tus tours."))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ color: COLORS.navy, fontSize: 24 }}>Mis tours</h1>
          <Link to="/operador/crear-tour" style={{ background: COLORS.gold, color: COLORS.navyDark, textDecoration: "none", padding: "10px 16px", borderRadius: 6, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={15} /> Crear tour
          </Link>
        </div>

        {cargando && <p style={{ color: COLORS.sub, fontSize: 14 }}>Cargando...</p>}
        {errorMsg && <p style={{ color: COLORS.sub, fontSize: 13 }}>{errorMsg}</p>}
        {!cargando && !errorMsg && tours.length === 0 && (
          <p style={{ color: COLORS.sub, fontSize: 14, border: `1px dashed ${COLORS.line}`, borderRadius: 8, padding: 30, textAlign: "center" }}>
            Todavía no has creado ningún tour.
          </p>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {tours.map((t) => (
            <div key={t.id_tour} style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy }}>{t.nombre_tour}</div>
                <div style={{ fontSize: 12, color: COLORS.sub }}>{t.ciudad}, {t.pais} · {t.duracion} noches · {t.cupos} cupos</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{money(t.precio)}</div>
                <span style={{ fontSize: 11, background: t.estado === "Activo" ? "#EAF3EE" : "#F3E9E9", color: t.estado === "Activo" ? "#1F7A6C" : "#B91C1C", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>
                  {t.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
