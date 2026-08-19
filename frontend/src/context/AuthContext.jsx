import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { CARGOS } from "../styles/theme";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar la app, pregunta al backend si la cookie token_acceso sigue
  // siendo válida. Tu ruta POST /usuarios/verificar solo responde si el
  // body trae enviarJson: true (ver Middlewares/Auth.mjs).
  useEffect(() => {
    api
      .post("/usuarios/verificar", { enviarJson: true })
      .then((res) => {
        if (res.data.autenticado) setUsuario(res.data.usuario);
      })
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/usuarios/Login", { email, password });
    // El backend no expone /usuarios/verificar con datos completos tras el
    // login en un solo paso claro, así que volvemos a preguntar quién es
    // el usuario autenticado para tener el shape consistente (rol, etc.)
    const verif = await api.post("/usuarios/verificar", { enviarJson: true });
    setUsuario(verif.data.usuario);
    return verif.data.usuario;
  }

  async function registrar(payload) {
    // El registro público SIEMPRE es cargo: 1 (Cliente).
    // No se expone la opción de elegir cargo en el formulario.
    await api.post("/usuarios/Registrarusuarios", { ...payload, cargo: 1 });
    return login(payload.email, payload.password);
  }

  async function logout() {
    await api.post("/usuarios/logout").catch(() => {});
    setUsuario(null);
  }

  const rolNombre = usuario ? CARGOS[usuario.rol] : null;

  return (
    <AuthContext.Provider value={{ usuario, rolNombre, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
