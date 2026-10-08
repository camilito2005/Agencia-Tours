import http from "./http";

export const toursService = {
  listar: () => http.get("/tours"),
  obtener: (id) => http.get(`/tours/${id}`),
  misTours: () => http.get("/tours/mios"),
  crear: (datos) => http.post("/tours", datos),
  actualizar: (id, datos) => http.put(`/tours/${id}`, datos),
  eliminar: (id) => http.delete(`/tours/${id}`),
};

export default toursService;
