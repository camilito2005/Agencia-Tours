
-- ============================================
-- Rutas del Mundo - esquema inicial PostgreSQL
-- Se ejecuta automáticamente la primera vez que
-- se crea el contenedor de postgres (ver docker-compose.yml)
-- ============================================

CREATE TABLE cargos (
  id_cargo SERIAL PRIMARY KEY,
  descripcion_cargo VARCHAR(50) NOT NULL UNIQUE
);

-- El orden de este INSERT es lo que fija los IDs:
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
  -- direccion    VARCHAR(255),
  -- imagen_url   VARCHAR(255),
  id_cargo     INT NOT NULL REFERENCES cargos(id_cargo),
  estado       VARCHAR(20) NOT NULL DEFAULT 'activo', -- activo | inactivo
  creado_en    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE tours (
  id_tour      SERIAL PRIMARY KEY,
  pais         VARCHAR(100) NOT NULL,
  ciudad       VARCHAR(100) NOT NULL,
  hotel        VARCHAR(150) NOT NULL,
  duracion     INT NOT NULL,              -- noches
  comidas      VARCHAR(50)  NOT NULL,     -- Sin comidas | Desayuno incluido | Media pensión | Todo incluido
  precio       NUMERIC(12,2) NOT NULL,
  cupos        INT NOT NULL,
  descripcion  TEXT,
  estado       VARCHAR(20) NOT NULL DEFAULT 'Publicado',
    -- ciclo de vida: Borrador -> Publicado -> Agotado -> Finalizado / Cancelado
  id_operador  INT NOT NULL REFERENCES usuarios(id_usuario),
  creado_en    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE reservas (
  id_reserva   SERIAL PRIMARY KEY,
  id_tour      INT NOT NULL REFERENCES tours(id_tour),
  id_cliente   INT NOT NULL REFERENCES usuarios(id_usuario),
  estado       VARCHAR(20) NOT NULL DEFAULT 'Pendiente_pago',
    -- ciclo de vida: Pendiente_pago -> Pagada -> Confirmada -> En_curso
    --                -> Completada / Cancelada / Reembolsada
  monto        NUMERIC(12,2) NOT NULL,
  creado_en    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE notificaciones (
  id_notificacion SERIAL PRIMARY KEY,
  tipo            VARCHAR(50) NOT NULL,   -- ej. 'compra'
  mensaje         TEXT NOT NULL,
  id_reserva      INT REFERENCES reservas(id_reserva),
  leida           BOOLEAN NOT NULL DEFAULT false,
  creado_en       TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_tours_operador ON tours(id_operador);
CREATE INDEX idx_reservas_tour ON reservas(id_tour);
CREATE INDEX idx_reservas_cliente ON reservas(id_cliente);
EOF
echo ok
Salida

ok