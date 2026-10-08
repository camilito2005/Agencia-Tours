
import pool from "../Config/db.mjs";

export async function ObtenerDestinos() {
  const { rows } = await pool.query(
    `SELECT * FROM destinos WHERE estado != 'inactivo' ORDER BY pais, ciudad`
  );
  return rows;
}

export async function BuscarDestinoPorId(id) {
  const { rows } = await pool.query("SELECT * FROM destinos WHERE id_destino = $1", [id]);
  return rows[0] || null;
}

export async function CrearDestino(datos) {
  const { pais, ciudad, descripcion, imagen_url } = datos;
  const { rows } = await pool.query(
    `INSERT INTO destinos (pais, ciudad, descripcion, imagen_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [pais, ciudad, descripcion || null, imagen_url || null]
  );
  return rows[0];
}

export async function ActualizarDestino(id, datos) {
  const { pais, ciudad, descripcion, imagen_url, estado } = datos;
  const { rows } = await pool.query(
    `UPDATE destinos SET pais = $1, ciudad = $2, descripcion = $3, imagen_url = $4, estado = $5
     WHERE id_destino = $6 RETURNING *`,
    [pais, ciudad, descripcion || null, imagen_url || null, estado || "activo", id]
  );
  return rows[0] || null;
}

export async function EliminarDestino(id) {
  await pool.query("UPDATE destinos SET estado = 'inactivo' WHERE id_destino = $1", [id]);
  return true;
}
