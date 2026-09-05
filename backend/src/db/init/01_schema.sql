-- ============================================
-- Rutas del Mundo - esquema alineado a la cotización
-- (destinos, hoteles, tours, reservas, pagos, notificaciones)
-- Se ejecuta automáticamente la primera vez que se crea
-- el volumen de postgres (ver docker-compose.yml)
-- 20050402
-- ============================================

CREATE TABLE cargos (
  id_cargo SERIAL PRIMARY KEY,
  descripcion_cargo VARCHAR(50) NOT NULL UNIQUE
);

-- El orden de este INSERT fija los IDs:
-- 1 = Cliente, 2 = Operador, 3 = Administrador
INSERT INTO cargos (descripcion_cargo) VALUES
  ('Cliente'),
  ('Operador'),
  ('Administrador');

CREATE TABLE usuarios (
  id_usuario   SERIAL PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  "contraseña" VARCHAR(255) NOT NULL,
  telefono     VARCHAR(20)  NOT NULL,
  id_cargo     INT NOT NULL REFERENCES cargos(id_cargo),
  estado       VARCHAR(20) NOT NULL DEFAULT 'activo', -- activo | inactivo
  creado_en    TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- DESTINOS  (país/ciudad reutilizable entre varios tours)
-- ============================================
CREATE TABLE destinos (
  id_destino   SERIAL PRIMARY KEY,
  pais         VARCHAR(100) NOT NULL,
  ciudad       VARCHAR(100) NOT NULL,
  descripcion  TEXT,
  imagen_url   VARCHAR(255),
  estado       VARCHAR(20) NOT NULL DEFAULT 'activo', -- activo | inactivo
  creado_en    TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- HOTELES  (info del hospedaje, reutilizable entre varios tours)
-- ============================================
CREATE TABLE hoteles (
  id_hotel     SERIAL PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  pais         VARCHAR(100) NOT NULL,
  ciudad       VARCHAR(100) NOT NULL,
  descripcion  TEXT,
  categoria    VARCHAR(50),        -- ej. "4 estrellas", "Boutique"
  imagen_url   VARCHAR(255),
  servicios    TEXT,               -- lista libre: "piscina, wifi, desayuno..."
  estado       VARCHAR(20) NOT NULL DEFAULT 'activo',
  creado_en    TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- TOURS  (paquete turístico completo)
-- ============================================
CREATE TABLE tours (
  id_tour        SERIAL PRIMARY KEY,
  nombre_tour    VARCHAR(150) NOT NULL,
  id_destino     INT NOT NULL REFERENCES destinos(id_destino),
  id_hotel       INT REFERENCES hoteles(id_hotel),
  descripcion    TEXT,
  precio         NUMERIC(12,2) NOT NULL,
  moneda         VARCHAR(10) NOT NULL DEFAULT 'COP',
  fecha_salida   DATE,
  fecha_regreso  DATE,
  duracion       INT NOT NULL,        -- noches
  cupos          INT NOT NULL,        -- cupos disponibles actuales
  alimentacion   VARCHAR(50),         -- Sin comidas | Desayuno incluido | Media pensión | Todo incluido
  transporte     VARCHAR(100),
  incluye        TEXT,
  no_incluye     TEXT,
  imagen_url     VARCHAR(255),
  itinerario     TEXT,
  id_operador    INT NOT NULL REFERENCES usuarios(id_usuario),
  estado         VARCHAR(20) NOT NULL DEFAULT 'Activo', -- Activo | Inactivo | Agotado
  creado_en      TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- RESERVAS
-- ============================================
CREATE TABLE reservas (
  id_reserva        SERIAL PRIMARY KEY,
  id_tour            INT NOT NULL REFERENCES tours(id_tour),
  id_cliente         INT NOT NULL REFERENCES usuarios(id_usuario),
  cantidad_personas  INT NOT NULL DEFAULT 1,
  precio_unitario    NUMERIC(12,2) NOT NULL,
  valor_total        NUMERIC(12,2) NOT NULL,
  estado             VARCHAR(20) NOT NULL DEFAULT 'Pendiente', -- Pendiente | Confirmada | Cancelada
  creado_en          TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- PAGOS  (separado de la reserva, como pide la cotización)
-- ============================================
CREATE TABLE pagos (
  id_pago             SERIAL PRIMARY KEY,
  id_reserva          INT NOT NULL REFERENCES reservas(id_reserva),
  monto               NUMERIC(12,2) NOT NULL,
  estado              VARCHAR(20) NOT NULL DEFAULT 'Pendiente', -- Pendiente | Aprobado | Rechazado
  metodo_pago         VARCHAR(50),           -- ej. tarjeta, PSE, Nequi (lo informa la pasarela)
  referencia_pasarela VARCHAR(150),          -- ID de transacción que devuelve la pasarela
  creado_en           TIMESTAMP NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- NOTIFICACIONES
-- ============================================
CREATE TABLE notificaciones (
  id_notificacion SERIAL PRIMARY KEY,
  tipo            VARCHAR(50) NOT NULL,   -- ej. 'reserva', 'pago'
  mensaje         TEXT NOT NULL,
  id_reserva      INT REFERENCES reservas(id_reserva),
  leida           BOOLEAN NOT NULL DEFAULT false,
  creado_en       TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_tours_destino ON tours(id_destino);
CREATE INDEX idx_tours_hotel ON tours(id_hotel);
CREATE INDEX idx_tours_operador ON tours(id_operador);
CREATE INDEX idx_reservas_tour ON reservas(id_tour);
CREATE INDEX idx_reservas_cliente ON reservas(id_cliente);
CREATE INDEX idx_pagos_reserva ON pagos(id_reserva);