import { Router } from "express";
import {
  ListarHoteles,
  ObtenerHotel,
  CrearHotelController,
  EditarHotel,
  DesactivarHotel,
} from "../Controladores/Hoteles.Controlador.mjs";
import { VerificarToken, VerificarRol } from "../Middlewares/Auth.mjs";

const router = Router();

router.get("/", VerificarToken, VerificarRol(2, 3), ListarHoteles);
router.get("/:id", VerificarToken, VerificarRol(2, 3), ObtenerHotel);

router.post("/", VerificarToken, VerificarRol(3), CrearHotelController);
router.put("/:id", VerificarToken, VerificarRol(3), EditarHotel);
router.delete("/:id", VerificarToken, VerificarRol(3), DesactivarHotel);

export default router;