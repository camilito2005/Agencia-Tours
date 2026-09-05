import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from  "./components/protectedRouted";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Catalogo from "./pages/cliente/Catalogo";
import DetalleTour from "./pages/cliente/DetalleTour";
import MisTours from "./pages/operador/MisTours";
import Resumen from "./pages/admin/Resumen";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/tours" element={
            <ProtectedRoute roles={["cliente"]}><Catalogo /></ProtectedRoute>
          } />

          <Route path="/tours/:id" element={
            <ProtectedRoute roles={["cliente"]}><DetalleTour /></ProtectedRoute>
          } />

          <Route path="/operador" element={
            <ProtectedRoute roles={["operador"]}><MisTours /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={["administrador"]}><Resumen /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
