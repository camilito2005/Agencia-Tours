import pool from "../Config/db.mjs";

// Inserta un usuario nuevo. NuevoUsuario ya viene con password hasheado
// (lo hace el controlador) y con "cargo" = id_cargo a asignar.
export async function RegistrarUsuario(NuevoUsuario) {
  const { nombre, email, password, telefono, cargo } = NuevoUsuario;
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, email, "contraseña", telefono, id_cargo)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_usuario, nombre, email, telefono, id_cargo, estado, creado_en`,
    [nombre, email, password, telefono, cargo]
  );
  return rows[0];
}

export async function CompararEmail(email) {
  const { rows } = await pool.query("SELECT id_usuario FROM usuarios WHERE email = $1", [email]);
  return rows.length > 0;
}

// Trae el usuario CON la contraseña hasheada y el nombre del cargo
// (necesario para armar el JWT: rol, cargo, estado, etc.)
export async function BuscarUsuarioPorEmail(email) {
  const { rows } = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.email, u."contraseña", u.telefono,
            u.id_cargo, c.descripcion_cargo, u.estado
     FROM usuarios u
     JOIN cargos c ON c.id_cargo = u.id_cargo
     WHERE u.email = $1`,
    [email]
  );
  return rows[0] || null;
}

export async function BuscarUsuarioPorId(id) {
  const { rows } = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.email, u.telefono,
            u.id_cargo, c.descripcion_cargo, u.estado, u.creado_en
     FROM usuarios u
     JOIN cargos c ON c.id_cargo = u.id_cargo
     WHERE u.id_usuario = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function ObtenerUsuarios() {
  const { rows } = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.email, u.telefono,
            u.id_cargo, c.descripcion_cargo, u.estado, u.creado_en
     FROM usuarios u
     JOIN cargos c ON c.id_cargo = u.id_cargo
     WHERE u.estado != 'inactivo'
     ORDER BY u.creado_en DESC`
  );
  return rows;
}

export async function ObtenerUsuariosInactivos() {
  const { rows } = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.email, u.telefono,
            u.id_cargo, c.descripcion_cargo, u.estado
     FROM usuarios u
     JOIN cargos c ON c.id_cargo = u.id_cargo
     WHERE u.estado = 'inactivo'
     ORDER BY u.creado_en DESC`
  );
  return rows;
}

// Actualización que hace un ADMIN sobre cualquier usuario (nombre, teléfono, cargo)
export async function Actualizar_Perfil_Admin(id, datos) {
  const { nombre, telefono, cargo } = datos;
  const { rows } = await pool.query(
    `UPDATE usuarios SET nombre = $1, telefono = $2, id_cargo = $3
     WHERE id_usuario = $4
     RETURNING id_usuario, nombre, email, telefono, id_cargo, estado`,
    [nombre, telefono, cargo, id]
  );
  return rows[0] || null;
}

// Actualización que hace el propio usuario sobre sí mismo (solo datos básicos)
export async function Actualizar_Mi_Perfil(id, datos) {
  const { nombre, telefono } = datos;
  const { rows } = await pool.query(
    `UPDATE usuarios SET nombre = $1, telefono = $2
     WHERE id_usuario = $3
     RETURNING id_usuario, nombre, email, telefono, id_cargo, estado`,
    [nombre, telefono, id]
  );
  return rows[0] || null;
}

export async function Inactivarusuarios(id) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET estado = 'inactivo' WHERE id_usuario = $1 RETURNING id_usuario, estado`,
    [id]
  );
  return rows[0] || null;
}

export async function RestaurarUsuarios(id) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET estado = 'activo' WHERE id_usuario = $1 RETURNING id_usuario, estado`,
    [id]
  );
  return rows[0] || null;
}

export async function EliminarUsuarios(id) {
  await pool.query("DELETE FROM usuarios WHERE id_usuario = $1", [id]);
  return true;
}
