import http from "./http";

export const destinosService = {
  listar: () => http.get("/destinos"),
  obtener: (id) => http.get(`/destinos/${id}`),
  crear: (datos) => http.post("/destinos", datos),
  actualizar: (id, datos) => http.put(`/destinos/${id}`, datos),
  desactivar: (id) => http.delete(`/destinos/${id}`),
};

export default destinosService;
