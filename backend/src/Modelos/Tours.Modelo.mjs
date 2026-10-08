import pool from "../Config/db.mjs";

// Catálogo: solo tours activos, con destino y hotel ya "incluidos" (join)
// para que el frontend no tenga que hacer peticiones extra.
export async function ObtenerTours() {
  const { rows } = await pool.query(`
    SELECT
      t.id_tour, t.nombre_tour, t.descripcion, t.precio, t.moneda,
      t.fecha_salida, t.fecha_regreso, t.duracion, t.cupos,
      t.alimentacion, t.transporte, t.imagen_url, t.estado, t.creado_en,
      json_build_object('id_destino', d.id_destino, 'pais', d.pais, 'ciudad', d.ciudad) AS destino,
      CASE WHEN h.id_hotel IS NULL THEN NULL
           ELSE json_build_object('id_hotel', h.id_hotel, 'nombre', h.nombre, 'categoria', h.categoria)
      END AS hotel
    FROM tours t
    JOIN destinos d ON d.id_destino = t.id_destino
    LEFT JOIN hoteles h ON h.id_hotel = t.id_hotel
    WHERE t.estado = 'Activo'
    ORDER BY t.creado_en DESC
  `);
  return rows;
}

// Detalle completo (incluye+no_incluye+itinerario+datos del operador para contacto)
export async function BuscarTourPorId(id) {
  const { rows } = await pool.query(
    `
    SELECT
      t.*,
      json_build_object('id_destino', d.id_destino, 'pais', d.pais, 'ciudad', d.ciudad, 'descripcion', d.descripcion) AS destino,
      CASE WHEN h.id_hotel IS NULL THEN NULL
           ELSE json_build_object('id_hotel', h.id_hotel, 'nombre', h.nombre, 'categoria', h.categoria, 'descripcion', h.descripcion, 'servicios', h.servicios)
      END AS hotel,
      json_build_object('id_usuario', u.id_usuario, 'nombre', u.nombre, 'telefono', u.telefono) AS operador
    FROM tours t
    JOIN destinos d ON d.id_destino = t.id_destino
    LEFT JOIN hoteles h ON h.id_hotel = t.id_hotel
    JOIN usuarios u ON u.id_usuario = t.id_operador
    WHERE t.id_tour = $1
    `,
    [id]
  );
  return rows[0] || null;
}

export async function ObtenerIdOperadorDeTour(id) {
  const { rows } = await pool.query("SELECT id_operador FROM tours WHERE id_tour = $1", [id]);
  return rows[0]?.id_operador ?? null;
}

export async function CrearTour(datos, idOperador) {
  const {
    nombre_tour, id_destino, id_hotel, descripcion, precio, moneda,
    fecha_salida, fecha_regreso, duracion, cupos, alimentacion,
    transporte, incluye, no_incluye, imagen_url, itinerario,
  } = datos;

  const { rows } = await pool.query(
    `INSERT INTO tours (
       nombre_tour, id_destino, id_hotel, descripcion, precio, moneda,
       fecha_salida, fecha_regreso, duracion, cupos, alimentacion,
       transporte, incluye, no_incluye, imagen_url, itinerario, id_operador
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
     RETURNING *`,
    [
      nombre_tour, id_destino, id_hotel || null, descripcion || null, precio,
      moneda || "COP", fecha_salida || null, fecha_regreso || null, duracion,
      cupos, alimentacion || null, transporte || null, incluye || null,
      no_incluye || null, imagen_url || null, itinerario || null, idOperador,
    ]
  );
  return rows[0];
}

export async function ActualizarTour(id, datos) {
  const {
    nombre_tour, id_destino, id_hotel, descripcion, precio, moneda,
    fecha_salida, fecha_regreso, duracion, cupos, alimentacion,
    transporte, incluye, no_incluye, imagen_url, itinerario, estado,
  } = datos;

  const { rows } = await pool.query(
    `UPDATE tours SET
       nombre_tour=$1, id_destino=$2, id_hotel=$3, descripcion=$4, precio=$5, moneda=$6,
       fecha_salida=$7, fecha_regreso=$8, duracion=$9, cupos=$10, alimentacion=$11,
       transporte=$12, incluye=$13, no_incluye=$14, imagen_url=$15, itinerario=$16, estado=$17
     WHERE id_tour = $18
     RETURNING *`,
    [
      nombre_tour, id_destino, id_hotel || null, descripcion || null, precio,
      moneda || "COP", fecha_salida || null, fecha_regreso || null, duracion,
      cupos, alimentacion || null, transporte || null, incluye || null,
      no_incluye || null, imagen_url || null, itinerario || null,
      estado || "Activo", id,
    ]
  );
  return rows[0] || null;
}

export async function EliminarTour(id) {
  await pool.query("DELETE FROM tours WHERE id_tour = $1", [id]);
  return true;
}

// Usado por el módulo de Tours del panel operador/admin (no el catálogo público)
export async function ObtenerToursPorOperador(idOperador) {
  const { rows } = await pool.query(
    `SELECT t.*, d.pais, d.ciudad
     FROM tours t
     JOIN destinos d ON d.id_destino = t.id_destino
     WHERE t.id_operador = $1
     ORDER BY t.creado_en DESC`,
    [idOperador]
  );
  return rows;
}