import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pool from "./Config/db.mjs";



// Iremos descomentando esto a medida que creemos cada archivo de rutas:
import UsuariosRoutes from "./Rutas/Usuarios.Rutas.mjs";
// import ToursRoutes from "./Rutas/Tours.rutas.mjs";
// import ReservasRoutes from "./Rutas/Reservas.rutas.mjs";
// import NotificacionesRoutes from "./Rutas/Notificaciones.rutas.mjs";

dotenv.config();

const app = express();

// El token viaja en cookie httpOnly, no en header Authorization, así que
// el origin NO puede ser "*" y credentials tiene que ir en true.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS hora_actual");
    res.json({ conectado: true, hora_actual: result.rows[0].hora_actual });
  } catch (err) {
    console.error("Error conectando a la base de datos:", err);
    res.status(500).json({ conectado: false, error: err.message });
  }
});

app.use("/api/usuarios", UsuariosRoutes);
// app.use("/api/tours", ToursRoutes);
// app.use("/api/reservas", ReservasRoutes);
// app.use("/api/notificaciones", NotificacionesRoutes);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada." }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en el puerto ${PORT}`));



