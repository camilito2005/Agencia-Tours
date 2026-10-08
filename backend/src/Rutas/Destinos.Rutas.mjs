import { Router } from "express";
import {
  ListarDestinos,
  ObtenerDestino,
  CrearDestinoController,
  EditarDestino,
  DesactivarDestino,
} from "../Controladores/Destinos.controlador.mjs";
import { VerificarToken, VerificarRol } from "../Middlewares/Auth.mjs";

const router = Router();

// Admin y Operador pueden CONSULTAR destinos (los necesitan para crear tours)
router.get("/", VerificarToken, VerificarRol(2, 3), ListarDestinos);
router.get("/:id", VerificarToken, VerificarRol(2, 3), ObtenerDestino);

// Solo ADMIN puede crear/editar/desactivar destinos
router.post("/", VerificarToken, VerificarRol(3), CrearDestinoController);
router.put("/:id", VerificarToken, VerificarRol(3), EditarDestino);
router.delete("/:id", VerificarToken, VerificarRol(3), DesactivarDestino);

export default router;