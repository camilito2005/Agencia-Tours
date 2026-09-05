import { Router } from "express";
import {
  RegistrarUsuarios,
  ListarUsuarios,
  PerfilAdmin,
  ActualizarPerfilAdmin,
  AutenticarUsuario,
  CerrarSesion,
  Inactivarusuario,
  UsuariosInactivos,
  RestaurarUsuario,
  EliminarUsuario,
  ActualizarMiPerfil,
  ObtenerMiPerfil,
  CrearStaff,
} from "../Controladores/Usuarios.Controlador.mjs";
import { VerificarToken, VerificarRol } from "../Middlewares/Auth.mjs";

const router = Router();

router.post("/Registrarusuarios", RegistrarUsuarios);
router.post("/Login", AutenticarUsuario);
router.post("/verificar", VerificarToken); // responde inline si enviarJson: true
router.post("/logout", CerrarSesion);

// Solo ADMIN (id_cargo = 3)
router.get("/Listarusuarios", VerificarToken, VerificarRol(3), ListarUsuarios);
router.get("/perfil_admin/:usuarioId", VerificarToken, VerificarRol(3), PerfilAdmin);
router.put("/actualizar_perfil_admin/:usuarioId", VerificarToken, VerificarRol(3), ActualizarPerfilAdmin);
router.post("/Inactivarusuario/:usuarioId", VerificarToken, VerificarRol(3), Inactivarusuario);
router.delete("/eliminar_usuario/:id", VerificarToken, VerificarRol(3), EliminarUsuario);
router.get("/inactivos", VerificarToken, VerificarRol(3), UsuariosInactivos);
router.post("/restaurar/:id", VerificarToken, VerificarRol(3), RestaurarUsuario);
router.post("/crear-staff", VerificarToken, VerificarRol(3), CrearStaff);

// Cualquier usuario autenticado, sobre sí mismo
router.put("/actualizar_mi_perfil", VerificarToken, ActualizarMiPerfil);
router.get("/yo", VerificarToken, ObtenerMiPerfil);

export default router;
