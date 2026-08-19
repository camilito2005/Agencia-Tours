// Crea el usuario Administrador inicial. Es el ÚNICO admin que se crea
// "a mano" - de ahí en adelante, los administradores y operadores los
// crea otro admin ya autenticado desde el panel (nunca por registro público).
import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "./Config/db.mjs";

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@rutasdelmundo.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "CambiaEstaClave123!";
  const telefono = process.env.SEED_ADMIN_PHONE || "573000000000";

  const existe = await pool.query("SELECT id_usuario FROM usuarios WHERE email = $1", [email]);
  if (existe.rows.length > 0) {
    console.log(`Ya existe un usuario con el correo ${email}. No se creó ninguno nuevo.`);
    await pool.end();
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO usuarios (nombre, email, "contraseña", telefono, id_cargo, estado)
     VALUES ($1, $2, $3, $4, 3, 'activo')`, // id_cargo 3 = Administrador
    ["Administrador Principal", email, hash, telefono]
  );

  console.log("Usuario administrador creado:");
  console.log(`  Correo: ${email}`);
  console.log(`  Clave:  ${password}  (cámbiala después de iniciar sesión)`);
  await pool.end();
}

seed().catch((err) => {
  console.error("Error creando el admin:", err);
  process.exit(1);
});
