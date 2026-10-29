import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/src/Middlewares/upload.mjs -> subimos dos niveles para llegar a backend/uploads
// (coincide con el volumen "../backend/uploads:/app/uploads" de tu docker-compose)
const CARPETA_UPLOADS = path.join(__dirname, "..", "..", "uploads");

const CARPETAS_PERMITIDAS = ["destinos", "hoteles", "tours"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const entidad = CARPETAS_PERMITIDAS.includes(req.params.entidad) ? req.params.entidad : "general";
    const carpetaDestino = path.join(CARPETA_UPLOADS, entidad);
    fs.mkdirSync(carpetaDestino, { recursive: true }); // por si la carpeta no existe aún
    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombreUnico);
  },
});

const filtroArchivos = (req, file, cb) => {
  const permitidos = /jpeg|jpg|png|webp|gif/;
  const extValida = permitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeValido = permitidos.test(file.mimetype);
  if (extValida && mimeValido) return cb(null, true);
  cb(new Error("Solo se permiten imágenes (jpg, png, webp, gif)"));
};

export const upload = multer({
  storage,
  fileFilter: filtroArchivos,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});