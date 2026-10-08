import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protectedRouted";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

import Catalogo from "./pages/cliente/Catalogo";
import DetalleTour from "./pages/cliente/DetalleTour";

import MisTours from "./pages/operador/MisTours";
import CrearTour from "./pages/operador/CrearTour";

import Resumen from "./pages/admin/Resumen";
import Destinos from "./pages/admin/Destinos";
import Hoteles from "./pages/admin/Hoteles";

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
          <Route path="/operador/crear-tour" element={
            <ProtectedRoute roles={["operador"]}><CrearTour /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={["administrador"]}><Resumen /></ProtectedRoute>
          } />
          <Route path="/admin/destinos" element={
            <ProtectedRoute roles={["administrador"]}><Destinos /></ProtectedRoute>
          } />
          <Route path="/admin/hoteles" element={
            <ProtectedRoute roles={["administrador"]}><Hoteles /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
