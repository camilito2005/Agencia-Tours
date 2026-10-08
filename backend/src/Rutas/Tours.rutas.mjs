import { Router } from "express";
import {
  ListarTours,
  ObtenerTour,
  CrearTourController,
  EditarTour,
  EliminarTourController,
  MisTours,
} from "../Controladores/Tours.Controlador.mjs";
import { VerificarToken, VerificarRol } from "../Middlewares/Auth.mjs";

const router = Router();

// Catálogo: cualquier usuario autenticado (cliente, operador o admin)
router.get("/", VerificarToken, ListarTours);
router.get("/mios", VerificarToken, VerificarRol(2), MisTours); // antes de "/:id" para que no choque la ruta
router.get("/:id", VerificarToken, ObtenerTour);

// Crear/editar: ADMIN u OPERADOR
router.post("/", VerificarToken, VerificarRol(2, 3), CrearTourController);
router.put("/:id", VerificarToken, VerificarRol(2, 3), EditarTour);

// Eliminar: solo ADMIN
router.delete("/:id", VerificarToken, VerificarRol(3), EliminarTourController);

export default router;