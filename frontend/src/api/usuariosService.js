import http from "./http";

// Todo lo relacionado a /api/usuarios vive aquí. Componentes y contexto
// llaman estas funciones, nunca a axios/http directamente — así si mañana
// cambia una ruta del backend, solo se edita en un lugar.
export const usuariosService = {
  registrar: (datos) => http.post("/usuarios/Registrarusuarios", { ...datos, cargo: 1 }),
  login: (email, password) => http.post("/usuarios/Login", { email, password }),
  verificar: () => http.post("/usuarios/verificar", { enviarJson: true }),
  logout: () => http.post("/usuarios/logout"),
  obtenerMiPerfil: () => http.get("/usuarios/yo"),
  actualizarMiPerfil: (datos) => http.put("/usuarios/actualizar_mi_perfil", datos),

  // Solo ADMIN
  listar: () => http.get("/usuarios/Listarusuarios"),
  listarInactivos: () => http.get("/usuarios/inactivos"),
  perfilAdmin: (id) => http.get(`/usuarios/perfil_admin/${id}`),
  actualizarPerfilAdmin: (id, datos) => http.put(`/usuarios/actualizar_perfil_admin/${id}`, datos),
  inactivar: (id) => http.post(`/usuarios/Inactivarusuario/${id}`),
  restaurar: (id) => http.post(`/usuarios/restaurar/${id}`),
  eliminar: (id) => http.delete(`/usuarios/eliminar_usuario/${id}`),
  crearStaff: (datos) => http.post("/usuarios/crear-staff", datos), // cargo: 2 (Operador) o 3 (Admin)
};

export default usuariosService;
