import {
  RegistrarUsuario,
  ObtenerUsuarios,
  CompararEmail,
  BuscarUsuarioPorEmail,
  BuscarUsuarioPorId,
  Actualizar_Perfil_Admin,
  Actualizar_Mi_Perfil,
  Inactivarusuarios,
  ObtenerUsuariosInactivos,
  RestaurarUsuarios,
  EliminarUsuarios,
} from "../Modelos/Usuarios.modelo.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// -------------------------------
// REGISTRO PÚBLICO - siempre cargo = 1 (Cliente)
// -------------------------------
export async function RegistrarUsuarios(req, res) {
  try {
    const NuevoUsuario = req.body;

    if (
      !NuevoUsuario.nombre ||
      !NuevoUsuario.email ||
      !NuevoUsuario.password ||
      !NuevoUsuario.comfirm_password ||
      !NuevoUsuario.cargo ||
      !NuevoUsuario.telefono
    ) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Datos incompletos", message: "Debe completar todos los campos obligatorios", type: "error" },
      });
    }

    const existeEmail = await CompararEmail(NuevoUsuario.email);
    if (existeEmail) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Email inválido", message: "El email ya está en uso", type: "error" },
      });
    }

    if (NuevoUsuario.password.trim().length < 6) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Contraseña inválida", message: "Debe tener al menos 6 caracteres", type: "error" },
      });
    }

    if (NuevoUsuario.comfirm_password.trim() !== NuevoUsuario.password) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Contraseña inválida", message: "Las contraseñas no coinciden", type: "error" },
      });
    }

    // El registro público SOLO puede crear clientes (id_cargo = 1).
    // Operador/Administrador los crea un admin ya autenticado (ver CrearStaff).
    if (Number(NuevoUsuario.cargo) !== 1) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Error", message: "El rol de usuario no es válido", type: "error" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    NuevoUsuario.password = await bcrypt.hash(NuevoUsuario.password, salt);

    const resultado = await RegistrarUsuario(NuevoUsuario);

    return res.status(201).json({
      showModal: true,
      modal: { title: "Éxito", message: "Usuario creado exitosamente", type: "success" },
      mensaje: "Usuario registrado correctamente",
      usuario: resultado,
    });
  } catch (error) {
    console.error("Error en RegistrarUsuarios:", error);
    return res.status(500).json({
      showModal: true,
      modal: { title: "Error del servidor", message: "Ocurrió un error al registrar el usuario", type: "error" },
    });
  }
}

// -------------------------------
// LOGIN
// -------------------------------
export async function AutenticarUsuario(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Faltan credenciales",
        showModal: true,
        modal: { title: "Error", message: "Debes ingresar correo y contraseña", type: "error" },
      });
    }

    const usuario = await BuscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        showModal: true,
        modal: { title: "Error", message: "No hay ningún usuario con el email ingresado", type: "error" },
      });
    }

    if (usuario.estado === "inactivo") {
      return res.status(403).json({
        error: "Usuario inactivo",
        showModal: true,
        modal: { title: "Usuario inactivo", message: "El usuario está inactivo. Contacta al administrador.", type: "error" },
      });
    }

    const coincide = await bcrypt.compare(password, usuario["contraseña"]);
    if (!coincide) {
      return res.status(401).json({
        error: "INVALIDO",
        showModal: true,
        modal: { title: "Credenciales incorrectas", message: "La contraseña es incorrecta", type: "error" },
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.id_cargo,
        cargo: usuario.descripcion_cargo,
        estado: usuario.estado,
        correo: usuario.email,
        contacto: usuario.telefono,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token_acceso", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    const { "contraseña": _omitida, ...usuarioSinClave } = usuario;
    return res.json({ usuario: usuarioSinClave });
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      showModal: true,
      modal: { title: "Error del servidor", message: "Ocurrió un error al procesar la solicitud", type: "error" },
    });
  }
}

export function CerrarSesion(req, res) {
  res.clearCookie("token_acceso");
  return res.json({
    showModal: true,
    modal: { title: "Sesión cerrada", message: "Has cerrado sesión correctamente", type: "success" },
  });
}

// -------------------------------
// SOLO ADMIN: crear Operador o Administrador.
// Nunca se expone en el registro público.
// -------------------------------
export async function CrearStaff(req, res) {
  try {
    const { nombre, email, password, telefono, cargo } = req.body;

    if (![2, 3].includes(Number(cargo))) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Error", message: "El cargo debe ser Operador (2) o Administrador (3)", type: "error" },
      });
    }
    if (!nombre || !email || !password || !telefono) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Datos incompletos", message: "Debe completar todos los campos obligatorios", type: "error" },
      });
    }

    const existeEmail = await CompararEmail(email);
    if (existeEmail) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Email inválido", message: "El email ya está en uso", type: "error" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const resultado = await RegistrarUsuario({ nombre, email, password: passwordHash, telefono, cargo });

    return res.status(201).json({
      showModal: true,
      modal: { title: "Éxito", message: "Usuario creado exitosamente", type: "success" },
      usuario: resultado,
    });
  } catch (error) {
    console.error("Error en CrearStaff:", error);
    return res.status(500).json({
      showModal: true,
      modal: { title: "Error del servidor", message: "Ocurrió un error al crear el usuario", type: "error" },
    });
  }
}

// -------------------------------
// Gestión de usuarios (ADMIN)
// -------------------------------
export async function ListarUsuarios(req, res) {
  const usuarios = await ObtenerUsuarios();
  return res.json(usuarios);
}

export async function PerfilAdmin(req, res) {
  const usuario = await BuscarUsuarioPorId(req.params.usuarioId);
  if (!usuario) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El usuario no existe", type: "error" },
    });
  }
  return res.json(usuario);
}

export async function ActualizarPerfilAdmin(req, res) {
  const actualizado = await Actualizar_Perfil_Admin(req.params.usuarioId, req.body);
  if (!actualizado) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El usuario no existe", type: "error" },
    });
  }
  return res.json({
    showModal: true,
    modal: { title: "Actualizado", message: "Perfil actualizado correctamente", type: "success" },
    usuario: actualizado,
  });
}

export async function Inactivarusuario(req, res) {
  const resultado = await Inactivarusuarios(req.params.usuarioId);
  return res.json({
    showModal: true,
    modal: { title: "Usuario inactivado", message: "El usuario fue desactivado", type: "success" },
    resultado,
  });
}

export async function UsuariosInactivos(req, res) {
  const usuarios = await ObtenerUsuariosInactivos();
  return res.json(usuarios);
}

export async function RestaurarUsuario(req, res) {
  const resultado = await RestaurarUsuarios(req.params.id);
  return res.json({
    showModal: true,
    modal: { title: "Usuario restaurado", message: "El usuario fue reactivado", type: "success" },
    resultado,
  });
}

export async function EliminarUsuario(req, res) {
  await EliminarUsuarios(req.params.id);
  return res.json({
    showModal: true,
    modal: { title: "Usuario eliminado", message: "El usuario fue eliminado permanentemente", type: "success" },
  });
}

// -------------------------------
// Perfil propio (cualquier usuario autenticado)
// -------------------------------
export async function ObtenerMiPerfil(req, res) {
  const usuario = await BuscarUsuarioPorId(req.usuario.id);
  return res.json(usuario);
}

export async function ActualizarMiPerfil(req, res) {
  const actualizado = await Actualizar_Mi_Perfil(req.usuario.id, req.body);
  return res.json({
    showModal: true,
    modal: { title: "Perfil actualizado", message: "Tus datos fueron actualizados", type: "success" },
    usuario: actualizado,
  });
}
