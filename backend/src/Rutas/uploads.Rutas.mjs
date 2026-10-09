import { Router } from "express";
import { upload } from "../Middlewares/uploads.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs";

const router = Router();

// Qué roles pueden subir imagen de cada entidad (mismo criterio que ya
// aplicamos en Destinos/Hoteles/Tours.rutas.mjs)
const ROLES_POR_ENTIDAD = {
  destinos: [3],
  hoteles: [3],
  tours: [2, 3],
};

function verificarPermisoUpload(req, res, next) {
  const permitidos = ROLES_POR_ENTIDAD[req.params.entidad];
  if (!permitidos) {
    return res.status(400).json({
      showModal: true,
      modal: { title: "Error", message: "Tipo de imagen no válido", type: "error" },
    });
  }
  if (!permitidos.includes(req.usuario.rol)) {
    return res.status(403).json({
      showModal: true,
      modal: { title: "Acceso denegado", message: "No tienes permiso para subir esta imagen", type: "error" },
    });
  }
  next();
}

// POST /api/uploads/destinos | /api/uploads/hoteles | /api/uploads/tours
router.post(
  "/:entidad",
  VerificarToken,
  verificarPermisoUpload,
  upload.single("imagen"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Error", message: "No se recibió ninguna imagen", type: "error" },
      });
    }
    const url = `/uploads/${req.params.entidad}/${req.file.filename}`;
    return res.status(201).json({ url });
  }
);

// Captura errores propios de multer (tamaño excedido, tipo de archivo no permitido)
router.use((err, req, res, next) => {
  return res.status(400).json({
    showModal: true,
    modal: { title: "Error al subir imagen", message: err.message, type: "error" },
  });
});

export default router;