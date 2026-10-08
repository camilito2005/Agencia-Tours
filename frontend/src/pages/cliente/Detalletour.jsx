import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Hotel, Calendar, UtensilsCrossed, MapPin, Bus, Check, X, Users } from "lucide-react";
import api from "../../api/axios";
import NavBar from "../../components/NavBar";
import { money } from "../../styles/theme";

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
      <div className="page">
        <NavBar />
        <div className="container-md text-sub">Cargando...</div>
      </div>
    );
  }

  if (errorMsg || !tour) {
    return (
      <div className="page">
        <NavBar />
        <div className="container-md">
          <Link to="/tours" className="link-back">&larr; Volver al catálogo</Link>
          <p className="notice-box mt-3">{errorMsg || "Tour no encontrado."}</p>
        </div>
      </div>
    );
  }

  const valorTotal = tour.precio * personas;

  return (
    <div className="page">
      <NavBar />
      <div className="container-md">
        <Link to="/tours" className="link-back">&larr; Volver al catálogo</Link>

        <div className="card card-lg mt-2">
          <div className="tour-card-location"><MapPin size={13} /> {tour.destino?.ciudad}, {tour.destino?.pais}</div>
          <h1 className="title-lg">{tour.nombre_tour}</h1>
          <p className="section-text mb-4 max-w-600">{tour.descripcion}</p>

          <div className="info-grid">
            {tour.hotel?.nombre && <InfoBlock icon={<Hotel size={16} />} label="Hotel" value={tour.hotel.nombre} />}
            <InfoBlock icon={<Calendar size={16} />} label="Duración" value={`${tour.duracion} noches`} />
            {tour.alimentacion && <InfoBlock icon={<UtensilsCrossed size={16} />} label="Alimentación" value={tour.alimentacion} />}
            {tour.transporte && <InfoBlock icon={<Bus size={16} />} label="Transporte" value={tour.transporte} />}
          </div>

          {(tour.fecha_salida || tour.fecha_regreso) && (
            <p className="subtitle">
              Salida: <strong>{tour.fecha_salida || "-"}</strong> · Regreso: <strong>{tour.fecha_regreso || "-"}</strong>
            </p>
          )}

          {tour.incluye && (
            <div className="section-block">
              <div className="section-title"><Check size={15} className="text-navy" /> Incluye</div>
              <p className="section-text">{tour.incluye}</p>
            </div>
          )}
          {tour.no_incluye && (
            <div className="section-block">
              <div className="section-title"><X size={15} className="text-sub" /> No incluye</div>
              <p className="section-text-sub">{tour.no_incluye}</p>
            </div>
          )}
          {tour.itinerario && (
            <div className="section-block">
              <div className="section-title">Itinerario</div>
              <p className="section-text">{tour.itinerario}</p>
            </div>
          )}

          <div className="reserve-box">
            {reservaOk ? (
              <div className="reserve-success">
                <div className="reserve-success-title">¡Reserva creada!</div>
                <div className="section-text">
                  Estado: <strong>{reservaOk.estado || "Pendiente"}</strong>. El siguiente paso será el pago (aún por construir).
                </div>
              </div>
            ) : (
              <>
                <div className="reserve-row">
                  <div>
                    <label className="label-inline flex-gap-1"><Users size={13} /> Personas</label>
                    <input type="number" min="1" max={tour.cupos} value={personas}
                      onChange={(e) => setPersonas(Math.max(1, Number(e.target.value)))}
                      className="field reserve-input mt-1" />
                  </div>
                  <div>
                    <div className="reserve-total-label">Total</div>
                    <div className="reserve-total-value">{money(valorTotal)}</div>
                  </div>
                  <button onClick={reservar} disabled={reservando || tour.cupos < 1} className="btn btn-primary ml-auto">
                    {tour.cupos < 1 ? "Sin cupos" : reservando ? "Reservando..." : "Reservar"}
                  </button>
                </div>
                {reservaError && <p className="text-error mt-2">{reservaError}</p>}
                <p className="label-inline mt-2">{tour.cupos} cupos disponibles.</p>
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
    <div className="info-block">
      <div className="info-block-icon">{icon}</div>
      <div className="info-block-label">{label}</div>
      <div className="info-block-value">{value}</div>
    </div>
  );
}
