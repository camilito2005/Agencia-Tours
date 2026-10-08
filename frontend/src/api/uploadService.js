import http from "./http";

export const uploadService = {
  // Sube un archivo (input type="file") y devuelve { url: "/uploads/xxx.jpg" }
  subirImagen: (archivo) => {
    const formData = new FormData();
    formData.append("imagen", archivo);
    return http.post("/uploads", formData); // axios detecta FormData y arma el multipart solo
  },
};

export default uploadService;