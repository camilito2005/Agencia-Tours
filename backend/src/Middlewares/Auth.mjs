import jwt from "jsonwebtoken";

export function VerificarToken(req, res, next) {
  const token = req.cookies?.token_acceso;
  const enviarJson = req.body?.enviarJson;

  if (!token) {
    return res.status(401).json({
      autenticado: false,
      showModal: true,
      modal: {
        title: "Sesión no iniciada",
        message: "Por favor inicia sesión para continuar.",
        type: "error",
      },
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    if (enviarJson) {
      res.json({ autenticado: true, usuario: req.usuario });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      autenticado: false,
      showModal: true,
      modal: {
        title: "Sesión expirada",
        message: "Tu sesión ha caducado. Inicia sesión nuevamente.",
        type: "error",
      },
    });
  }
}

// NUEVO: complementa a VerificarToken. Se usa siempre DESPUÉS de él en la
// cadena de middlewares, porque necesita leer req.usuario.rol (el id_cargo
// que va dentro del JWT). Uso: VerificarRol(3) o VerificarRol(2, 3)
export function VerificarRol(...cargosPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        showModal: true,
        modal: { title: "No autenticado", message: "Inicia sesión para continuar.", type: "error" },
      });
    }
    if (!cargosPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        showModal: true,
        modal: { title: "Acceso denegado", message: "No tienes permisos para esta acción.", type: "error" },
      });
    }
    next();
  };
}
