import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Hotel, Calendar, UtensilsCrossed, MapPin, Bus, Check, X, Users } from "lucide-react";
import api from "../../api/axios";
import NavBar from "../../components/NavBar";
import { COLORS, money } from "../../styles/theme";

export default function DetalleTour() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [personas, setPersonas] = useState(1);
  const [reservando, setReservando] = useState(false);
  const [reservaOk, setReservaOk] = useState(null);
  const [reservaError, setReservaError] = useState("");

  useEffect(() => {
    // GET /api/tours/:id (pendiente en el backend) debe devolver el tour
    // completo con destino, hotel y operador (nombre + teléfono) incluidos.
    api
      .get(`/tours/${id}`)
      .then((res) => setTour(res.data))
      .catch(() => setErrorMsg("Aún no hay endpoint de detalle de tour en el backend, o no responde."))
      .finally(() => setCargando(false));
  }, [id]);

  async function reservar() {
    setReservando(true);
    setReservaError("");
    try {
      // POST /api/reservas (pendiente) — body esperado:
      // { id_tour, cantidad_personas }
      // el backend calcula valor_total = precio * cantidad_personas
      const { data } = await api.post("/reservas", { id_tour: Number(id), cantidad_personas: personas });
      setReservaOk(data);
    } catch (err) {
      setReservaError(err.response?.data?.modal?.message || "No se pudo completar la reserva. El endpoint de reservas aún no está construido.");
    } finally {
      setReservando(false);
    }
  }

  if (cargando) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg }}>
        <NavBar />
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 24, fontFamily: "sans-serif", color: COLORS.sub }}>Cargando...</div>
      </div>
    );
  }

  if (errorMsg || !tour) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg }}>
        <NavBar />
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 24, fontFamily: "sans-serif" }}>
          <Link to="/tours" style={{ color: COLORS.navy }}>&larr; Volver al catálogo</Link>
          <p style={{ color: COLORS.sub, fontSize: 13, background: "#fff", border: `1px dashed ${COLORS.line}`, padding: 14, borderRadius: 8, marginTop: 16 }}>
            {errorMsg || "Tour no encontrado."}
          </p>
        </div>
      </div>
    );
  }

  const valorTotal = tour.precio * personas;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 60px" }}>
        <Link to="/tours" style={{ color: COLORS.navy, fontSize: 14, textDecoration: "none" }}>&larr; Volver al catálogo</Link>

        <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 28, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.sub, marginBottom: 6 }}>
            <MapPin size={13} /> {tour.destino?.ciudad}, {tour.destino?.pais}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, margin: "0 0 14px" }}>{tour.nombre_tour}</h1>
          <p style={{ color: COLORS.ink, fontSize: 15, lineHeight: 1.6, marginBottom: 24, maxWidth: 600 }}>{tour.descripcion}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
            {tour.hotel?.nombre && <InfoBlock icon={<Hotel size={16} />} label="Hotel" value={tour.hotel.nombre} />}
            <InfoBlock icon={<Calendar size={16} />} label="Duración" value={`${tour.duracion} noches`} />
            {tour.alimentacion && <InfoBlock icon={<UtensilsCrossed size={16} />} label="Alimentación" value={tour.alimentacion} />}
            {tour.transporte && <InfoBlock icon={<Bus size={16} />} label="Transporte" value={tour.transporte} />}
          </div>

          {(tour.fecha_salida || tour.fecha_regreso) && (
            <p style={{ fontSize: 13, color: COLORS.sub, marginBottom: 20 }}>
              Salida: <strong>{tour.fecha_salida || "-"}</strong> · Regreso: <strong>{tour.fecha_regreso || "-"}</strong>
            </p>
          )}

          {tour.incluye && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={15} color={COLORS.gold} /> Incluye
              </div>
              <p style={{ fontSize: 14, color: COLORS.ink, whiteSpace: "pre-line" }}>{tour.incluye}</p>
            </div>
          )}
          {tour.no_incluye && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <X size={15} color={COLORS.sub} /> No incluye
              </div>
              <p style={{ fontSize: 14, color: COLORS.sub, whiteSpace: "pre-line" }}>{tour.no_incluye}</p>
            </div>
          )}
          {tour.itinerario && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy, marginBottom: 6 }}>Itinerario</div>
              <p style={{ fontSize: 14, color: COLORS.ink, whiteSpace: "pre-line" }}>{tour.itinerario}</p>
            </div>
          )}

          {/* Reserva */}
          <div style={{ borderTop: `2px dashed ${COLORS.line}`, paddingTop: 22 }}>
            {reservaOk ? (
              <div style={{ background: "#EAF3EE", border: "1px solid #1F7A6C", borderRadius: 8, padding: 18 }}>
                <div style={{ fontWeight: 700, color: "#1F7A6C", marginBottom: 4 }}>¡Reserva creada!</div>
                <div style={{ fontSize: 13, color: COLORS.ink }}>
                  Estado: <strong>{reservaOk.estado || "Pendiente"}</strong>. El siguiente paso será el pago (aún por construir).
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <label style={{ fontSize: 12, color: COLORS.sub, display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={13} /> Personas
                    </label>
                    <input type="number" min="1" max={tour.cupos} value={personas}
                      onChange={(e) => setPersonas(Math.max(1, Number(e.target.value)))}
                      style={{ width: 80, padding: 9, marginTop: 4, border: `1px solid ${COLORS.line}`, borderRadius: 6 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: COLORS.sub, textTransform: "uppercase" }}>Total</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy }}>{money(valorTotal)}</div>
                  </div>
                  <button onClick={reservar} disabled={reservando || tour.cupos < 1}
                    style={{ marginLeft: "auto", background: COLORS.gold, color: COLORS.navyDark, border: "none", padding: "13px 24px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>
                    {tour.cupos < 1 ? "Sin cupos" : reservando ? "Reservando..." : "Reservar"}
                  </button>
                </div>
                {reservaError && <p style={{ color: "#B91C1C", fontSize: 13, marginTop: 12 }}>{reservaError}</p>}
                <p style={{ fontSize: 12, color: COLORS.sub, marginTop: 10 }}>{tour.cupos} cupos disponibles.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 12 }}>
      <div style={{ color: COLORS.gold, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 11, color: COLORS.sub, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}
