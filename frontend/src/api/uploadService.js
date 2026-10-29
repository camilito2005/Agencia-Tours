import http from "./http";

// entidad: "destinos" | "hoteles" | "tours" -> define en qué carpeta del
// backend se guarda el archivo (ver Middlewares/upload.mjs)
export const uploadService = {
  subir: (archivo, entidad) => {
    const formData = new FormData();
    formData.append("imagen", archivo);
    // OJO: no hay que fijar Content-Type a mano — axios detecta que es un
    // FormData y arma el boundary de multipart/form-data automáticamente.
    return http.post(`/uploads/${entidad}`, formData);
  },
};

export default uploadService;