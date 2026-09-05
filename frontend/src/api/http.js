import api from "./axios";

// Wrapper delgado sobre axios: cada endpoint nuevo (tours, reservas, pagos...)
// llama a estas mismas 4 funciones en vez de usar axios directo, así toda
// la app comparte la misma configuración (baseURL, withCredentials, manejo
// de 401) y cambiarla en un solo lugar la actualiza en todas partes.
export const http = {
  get: (url, config) => api.get(url, config).then((res) => res.data),
  post: (url, body, config) => api.post(url, body, config).then((res) => res.data),
  put: (url, body, config) => api.put(url, body, config).then((res) => res.data),
  delete: (url, config) => api.delete(url, config).then((res) => res.data),
};

export default http;
