import http from "./http";

export const hotelesService = {
  listar: () => http.get("/hoteles"),
  obtener: (id) => http.get(`/hoteles/${id}`),
  crear: (datos) => http.post("/hoteles", datos),
  actualizar: (id, datos) => http.put(`/hoteles/${id}`, datos),
  desactivar: (id) => http.delete(`/hoteles/${id}`),
};

export default hotelesService;
