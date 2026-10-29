import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, UserX, UserCheck, Save, X } from "lucide-react";
import NavBar from "../../components/NavBar";
import usuariosService from "../../api/usuariosService";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../styles/theme";

const CARGO_LABEL = { 1: "Cliente", 2: "Operador", 3: "Administrador" };
const CARGO_COLOR = {
  1: { bg: "#EEF1F6", fg: COLORS.navy },
  2: { bg: "#FBF3DF", fg: COLORS.goldDark },
  3: { bg: COLORS.navy, fg: "#fff" },
};

const formVacio = { nombre: "", email: "", telefono: "", password: "", cargo: 2 };

export default function Usuarios() {
  const { usuario: yo } = useAuth();

  const [vista, setVista] = useState("activos"); // activos | inactivos
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("");

  const [form, setForm] = useState(formVacio);
  const [editando, setEditando] = useState(null); // usuario en edición o null
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  function cargar() {
    setCargando(true);
    const peticion = vista === "activos" ? usuariosService.listar() : usuariosService.listarInactivos();
    peticion
      .then(setUsuarios)
      .catch(() => setErrorMsg("No se pudieron cargar los usuarios."))
      .finally(() => setCargando(false));
  }

  useEffect(cargar, [vista]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => {
      const coincideTexto =
        !q ||
        u.nombre.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.telefono || "").includes(q);
      const coincideCargo = !filtroCargo || String(u.id_cargo) === filtroCargo;
      return coincideTexto && coincideCargo;
    });
  }, [usuarios, busqueda, filtroCargo]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function empezarEdicion(u) {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, telefono: u.telefono || "", password: "", cargo: u.id_cargo });
    setErrorMsg("");
    setOkMsg("");
  }

  function cancelarEdicion() {
    setEditando(null);
    setForm(formVacio);
    setErrorMsg("");
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorMsg("");
    setOkMsg("");
    try {
      if (editando) {
        await usuariosService.actualizarPerfilAdmin(editando.id_usuario, {
          nombre: form.nombre,
          telefono: form.telefono,
          cargo: Number(form.cargo),
        });
        setOkMsg("Usuario actualizado.");
      } else {
        await usuariosService.crearStaff({ ...form, cargo: Number(form.cargo) });
        setOkMsg("Usuario creado.");
      }
      setEditando(null);
      setForm(formVacio);
      cargar();
    } catch (err) {
      setErrorMsg(err.response?.data?.modal?.message || "No se pudo guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(u) {
    const inactivar = vista === "activos";
    const accion = inactivar ? "desactivar" : "reactivar";
    if (!window.confirm(`¿Seguro que quieres ${accion} a ${u.nombre}?`)) return;
    setErrorMsg("");
    setOkMsg("");
    try {
      if (inactivar) await usuariosService.inactivar(u.id_usuario);
      else await usuariosService.restaurar(u.id_usuario);
      setOkMsg(inactivar ? "Usuario desactivado." : "Usuario reactivado.");
      cargar();
    } catch (err) {
      setErrorMsg(err.response?.data?.modal?.message || "No se pudo cambiar el estado del usuario.");
    }
  }

  const campo = { width: "100%", padding: 9, marginTop: 4, border: `1px solid ${COLORS.line}`, borderRadius: 6, boxSizing: "border-box", fontSize: 14 };
  const label = { fontSize: 12, color: COLORS.sub, display: "block", marginTop: 10 };
  const esUnoMismo = editando && editando.id_usuario === yo?.id;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <NavBar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px 60px" }}>
        <Link to="/admin" style={{ color: COLORS.navy, fontSize: 14, textDecoration: "none" }}>&larr; Panel de administrador</Link>
        <h1 style={{ color: COLORS.navy, fontSize: 24, margin: "12px 0 20px" }}>Usuarios</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
          {/* ---------- Lista ---------- */}
          <div>
            {/* Pestañas */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["activos", "inactivos"].map((v) => (
                <button key={v} onClick={() => setVista(v)}
                  style={{
                    padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: `1px solid ${vista === v ? COLORS.navy : COLORS.line}`,
                    background: vista === v ? COLORS.navy : "#fff",
                    color: vista === v ? "#fff" : COLORS.sub,
                  }}>
                  {v === "activos" ? "Activos" : "Inactivos"}
                </button>
              ))}
            </div>

            {/* Búsqueda y filtro */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={15} color={COLORS.sub} style={{ position: "absolute", left: 10, top: 12 }} />
                <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre, correo o teléfono"
                  style={{ ...campo, marginTop: 0, paddingLeft: 32 }} />
              </div>
              <select value={filtroCargo} onChange={(e) => setFiltroCargo(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.line}`, background: "#fff", fontSize: 13 }}>
                <option value="">Todos los roles</option>
                <option value="1">Clientes</option>
                <option value="2">Operadores</option>
                <option value="3">Administradores</option>
              </select>
            </div>

            {okMsg && <p style={{ color: "#1F7A6C", fontSize: 13, marginBottom: 10 }}>{okMsg}</p>}
            {cargando && <p style={{ color: COLORS.sub, fontSize: 14 }}>Cargando...</p>}
            {!cargando && visibles.length === 0 && (
              <p style={{ color: COLORS.sub, fontSize: 14, border: `1px dashed ${COLORS.line}`, borderRadius: 8, padding: 24, textAlign: "center" }}>
                No hay usuarios {vista === "inactivos" ? "inactivos " : ""}que coincidan.
              </p>
            )}

            <div style={{ display: "grid", gap: 10 }}>
              {visibles.map((u) => {
                const color = CARGO_COLOR[u.id_cargo] || CARGO_COLOR[1];
                const esYo = u.id_usuario === yo?.id;
                return (
                  <div key={u.id_usuario} style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {u.nombre} {esYo && <span style={{ fontSize: 11, color: COLORS.sub }}>(tú)</span>}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.sub, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.email} · {u.telefono}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: color.bg, color: color.fg }}>
                      {CARGO_LABEL[u.id_cargo]}
                    </span>
                    {vista === "activos" && (
                      <button onClick={() => empezarEdicion(u)} title="Editar"
                        style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.navy }}>
                        <Pencil size={16} />
                      </button>
                    )}
                    {!esYo && (
                      <button onClick={() => cambiarEstado(u)} title={vista === "activos" ? "Desactivar" : "Reactivar"}
                        style={{ background: "none", border: "none", cursor: "pointer", color: vista === "activos" ? "#B91C1C" : "#1F7A6C" }}>
                        {vista === "activos" ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- Formulario ---------- */}
          <form onSubmit={guardar} style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 18, position: "sticky", top: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 4, color: COLORS.navy }}>
              {editando ? "Editar usuario" : "Nuevo operador o administrador"}
            </h3>
            {!editando && (
              <p style={{ fontSize: 12, color: COLORS.sub, marginBottom: 6 }}>
                Los clientes se registran solos desde la web. Aquí solo se crea personal.
              </p>
            )}

            <label style={label}>Nombre *</label>
            <input style={campo} value={form.nombre} onChange={set("nombre")} required />

            <label style={label}>Correo *</label>
            <input type="email" style={{ ...campo, background: editando ? "#F3F4F6" : "#fff" }}
              value={form.email} onChange={set("email")} required disabled={!!editando} />

            <label style={label}>Teléfono (WhatsApp) *</label>
            <input style={campo} value={form.telefono} onChange={set("telefono")} placeholder="573001234567" required />

            {!editando && (
              <>
                <label style={label}>Contraseña *</label>
                <input type="password" style={campo} value={form.password} onChange={set("password")} minLength={6} required />
              </>
            )}

            <label style={label}>Rol *</label>
            <select style={campo} value={form.cargo} onChange={set("cargo")} disabled={esUnoMismo}>
              {editando && editando.id_cargo === 1 && <option value={1}>Cliente</option>}
              <option value={2}>Operador</option>
              <option value={3}>Administrador</option>
            </select>
            {esUnoMismo && <p style={{ fontSize: 11, color: COLORS.sub, marginTop: 4 }}>No puedes cambiar tu propio rol.</p>}

            {errorMsg && <p style={{ color: "#B91C1C", fontSize: 12, marginTop: 10 }}>{errorMsg}</p>}

            <button type="submit" disabled={guardando}
              style={{ width: "100%", marginTop: 14, padding: 10, background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 6, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
              {editando ? <Save size={15} /> : <Plus size={15} />}
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear usuario"}
            </button>

            {editando && (
              <button type="button" onClick={cancelarEdicion}
                style={{ width: "100%", marginTop: 8, padding: 9, background: "none", color: COLORS.sub, border: `1px solid ${COLORS.line}`, borderRadius: 6, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
                <X size={14} /> Cancelar edición
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}