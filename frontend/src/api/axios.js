import axios from "axios";

// El token viaja en una cookie httpOnly (token_acceso) que pone el backend.
// withCredentials es obligatorio para que el navegador la envíe/reciba.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});


export default api;
