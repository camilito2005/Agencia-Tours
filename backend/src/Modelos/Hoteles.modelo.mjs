import pool from "../Config/db.mjs";

export async function ObtenerHoteles() {
  const { rows } = await pool.query(
    `SELECT * FROM hoteles WHERE estado != 'inactivo' ORDER BY nombre`
  );
  return rows;
}

export async function BuscarHotelPorId(id) {
  const { rows } = await pool.query("SELECT * FROM hoteles WHERE id_hotel = $1", [id]);
  return rows[0] || null;
}

export async function CrearHotel(datos) {
  const { nombre, pais, ciudad, descripcion, categoria, imagen_url, servicios } = datos;
  const { rows } = await pool.query(
    `INSERT INTO hoteles (nombre, pais, ciudad, descripcion, categoria, imagen_url, servicios)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nombre, pais, ciudad, descripcion || null, categoria || null, imagen_url || null, servicios || null]
  );
  return rows[0];
}

export async function ActualizarHotel(id, datos) {
  const { nombre, pais, ciudad, descripcion, categoria, imagen_url, servicios, estado } = datos;
  const { rows } = await pool.query(
    `UPDATE hoteles SET nombre=$1, pais=$2, ciudad=$3, descripcion=$4, categoria=$5,
            imagen_url=$6, servicios=$7, estado=$8
     WHERE id_hotel = $9 RETURNING *`,
    [nombre, pais, ciudad, descripcion || null, categoria || null, imagen_url || null, servicios || null, estado || "activo", id]
  );
  return rows[0] || null;
}

export async function EliminarHotel(id) {
  await pool.query("UPDATE hoteles SET estado = 'inactivo' WHERE id_hotel = $1", [id]);
  return true;
}