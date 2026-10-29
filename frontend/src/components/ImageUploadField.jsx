import React, { useState } from "react";
import { Upload } from "lucide-react";
import uploadService from "../api/uploadService";
import { COLORS, imagenUrl } from "../styles/theme";

// entidad: "destinos" | "hoteles" | "tours" -> decide en qué carpeta del
// backend se guarda (y qué roles tienen permiso, ver Upload.rutas.mjs)
export default function ImageUploadField({ value, onChange, entidad, label = "Imagen" }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function manejarArchivo(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSubiendo(true);
    setError("");
    try {
      const { url } = await uploadService.subir(archivo, entidad);
      onChange(url);
    } catch (err) {
      setError(err.response?.data?.modal?.message || "No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div>
      <label style={{ fontSize: 12, color: COLORS.sub, display: "block", marginBottom: 4 }}>{label}</label>

      {value && (
        <img
          src={imagenUrl(value)}
          alt="Vista previa"
          style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 6, marginBottom: 8, border: `1px solid ${COLORS.line}` }}
        />
      )}

      <label style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        border: `1px dashed ${COLORS.line}`, borderRadius: 6, padding: 12,
        cursor: subiendo ? "default" : "pointer", fontSize: 13, color: COLORS.sub, background: "#fff",
      }}>
        <Upload size={15} />
        {subiendo ? "Subiendo..." : value ? "Cambiar imagen" : "Seleccionar imagen"}
        <input type="file" accept="image/*" onChange={manejarArchivo} style={{ display: "none" }} disabled={subiendo} />
      </label>

      {error && <p style={{ color: "#B91C1C", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}