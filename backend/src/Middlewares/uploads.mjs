import multer from "multer";
import path from "path";
import fs from "fs";

const CARPETA_UPLOADS = path.resolve("uploads");
if (!fs.existsSync(CARPETA_UPLOADS)) fs.mkdirSync(CARPETA_UPLOADS, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CARPETA_UPLOADS),
  filename: (req, file, cb) => {
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, nombreUnico);
  },
});

function filtroImagenes(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten archivos de imagen."));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter: filtroImagenes,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});