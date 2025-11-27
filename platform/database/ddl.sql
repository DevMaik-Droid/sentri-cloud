-- ============================
-- SENTRI CLOUD - DOMINIOS
-- ============================

-- Dominio de correo electrónico válido
CREATE DOMAIN correo_electronico AS TEXT
CHECK (VALUE ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');

-- Tipos permitidos de runtimes
CREATE DOMAIN tipo_runtime AS TEXT
CHECK (VALUE IN ('nodejs', 'python', 'php', 'java', 'static', 'docker', 'desconocido','next'));
drop domain tipo_runtime;
-- Estados permitidos de proyectos
CREATE DOMAIN estado_proyecto AS TEXT
CHECK (VALUE IN ('activo', 'inactivo', 'suspendido'));

-- Estados permitidos de despliegos
CREATE DOMAIN estado_despliegue AS TEXT
CHECK (VALUE IN ('en_espera','construyendo','desplegando','ejecutando','fallido','detenido'));

-- Estados de VPS
CREATE DOMAIN estado_vps AS TEXT
CHECK (VALUE IN ('aprovisionando','ejecutando','detenido','reiniciando','terminado'));


-- ============================
-- TABLA: usuarios
-- ============================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correo correo_electronico,
    nombre TEXT NOT NULL,
    avatar_url TEXT,
    
    github_id TEXT UNIQUE,
    github_usuario TEXT,
    github_token_encriptado TEXT,

    correo_verificado BOOLEAN DEFAULT FALSE,

    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    ultimo_ingreso TIMESTAMPTZ
);

CREATE INDEX idx_usuarios_github_id ON usuarios(github_id);
drop table usuarios;

-- ============================
-- TABLA: proyectos
-- ============================

CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,

    nombre TEXT NOT NULL,
    slug TEXT NOT NULL,
    descripcion TEXT,

    tipo_origen TEXT NOT NULL CHECK (tipo_origen IN ('zip','github')),
    runtime tipo_runtime NOT NULL,
    version_runtime TEXT,
    framework VARCHAR(40),
    estado estado_proyecto DEFAULT 'activo',

    -- Configuración GitHub
    github_repo_nombre TEXT,
    github_rama TEXT,
    auto_desplegar BOOLEAN DEFAULT FALSE,

    -- Dominios
    url_publica TEXT,
    dominio_personalizado TEXT,

    ajustes JSONB DEFAULT '{}'::jsonb,

    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (usuario_id, slug)
);
drop table proyectos;
CREATE INDEX idx_proyectos_usuario ON proyectos(usuario_id);
CREATE INDEX idx_proyectos_estado ON proyectos(estado);



-- ============================
-- TABLA: vps
-- ============================

CREATE TABLE vps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,

    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('proyecto','independiente')),

    cpu_nucleos INT NOT NULL,
    ram_gb INT NOT NULL,
    almacenamiento_gb INT NOT NULL,
    sistema_operativo TEXT NOT NULL,

    ip_servidor TEXT,
    url_publica TEXT,

    estado estado_vps DEFAULT 'aprovisionando',

    ssh_usuario TEXT,
    ssh_contrasena_encriptada TEXT,
    puerto_ssh INT DEFAULT 22,

    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    terminado_en TIMESTAMPTZ
);

CREATE INDEX idx_vps_usuario ON vps(usuario_id);
CREATE INDEX idx_vps_proyecto ON vps(proyecto_id);
CREATE INDEX idx_vps_estado ON vps(estado);


-- ============================
-- TABLA: despliegues
-- ============================

CREATE TABLE despliegues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
    vps_id UUID REFERENCES vps(id) ON DELETE SET NULL,

    version INT NOT NULL,
    estado estado_despliegue DEFAULT 'en_espera',

    origen TEXT CHECK (origen IN ('zip','github')),
    origen_url TEXT,

    commit_sha TEXT,
    commit_mensaje TEXT,
    rama TEXT,

    contenedor_id TEXT,

    logs_construccion TEXT,
    logs_despliegue TEXT,
    duracion_construccion_ms BIGINT,

    iniciado_en TIMESTAMPTZ,
    completado_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(proyecto_id, version)
);

CREATE INDEX idx_despliegues_proyecto ON despliegues(proyecto_id);
CREATE INDEX idx_despliegues_estado ON despliegues(estado);
CREATE INDEX idx_despliegues_fecha ON despliegues(creado_en DESC);

-- ============================
-- TABLA: repositorios_github
-- ============================

CREATE TABLE repositorios_github (
    id TEXT PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,

    nombre TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    descripcion TEXT,
    lenguaje TEXT,

    estrellas INT DEFAULT 0,
    forks INT DEFAULT 0,

    ramas JSONB NOT NULL DEFAULT '[]'::jsonb,
    rama_principal TEXT,

    privado BOOLEAN DEFAULT FALSE,
    url_html TEXT NOT NULL,

    proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
    importado_en TIMESTAMPTZ,

    sincronizado_en TIMESTAMPTZ DEFAULT NOW(),
    creado_en TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (usuario_id, nombre_completo)
);

CREATE INDEX idx_repos_user ON repositorios_github(usuario_id);


-- ============================
-- TABLA: variables_entorno
-- ============================

CREATE TABLE variables_entorno (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,

    clave TEXT NOT NULL,
    valor_encriptado TEXT NOT NULL,

    entorno TEXT CHECK (entorno IN ('produccion','previsualizacion','desarrollo')),

    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (proyecto_id, clave, entorno)
);


-- ============================
-- TABLA: dominios_personalizados
-- ============================

CREATE TABLE dominios_personalizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,

    dominio TEXT NOT NULL,
    estado TEXT CHECK (estado IN ('pendiente','verificando','activo','fallido')) DEFAULT 'pendiente',

    registro_verificacion TEXT,
    verificado_en TIMESTAMPTZ,

    estado_ssl TEXT CHECK (estado_ssl IN ('pendiente','activo','expirado')) DEFAULT 'pendiente',
    ssl_expira_en TIMESTAMPTZ,

    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_dominio ON dominios_personalizados(dominio);
CREATE INDEX idx_dominio_proyecto ON dominios_personalizados(proyecto_id);


-- ============================
-- TABLA: actividad
-- ============================

CREATE TABLE actividad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

    accion TEXT NOT NULL,
    tipo_recurso TEXT NOT NULL,
    recurso_id TEXT NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,
    ip TEXT,
    user_agent TEXT,

    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_actividad_usuario ON actividad(usuario_id);
CREATE INDEX idx_actividad_fecha ON actividad(creado_en DESC);
CREATE INDEX idx_actividad_recurso ON actividad(tipo_recurso, recurso_id);


-- ============================
-- TABLA: webhooks
-- ============================

CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,

    tipo TEXT CHECK (tipo IN ('github','custom')),
    url TEXT NOT NULL,
    secreto_encriptado TEXT NOT NULL,

    eventos JSONB NOT NULL DEFAULT '[]'::jsonb,

    activo BOOLEAN DEFAULT TRUE,
    ultimo_disparo TIMESTAMPTZ,
    ultimo_estado INT,

    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_proyecto ON webhooks(proyecto_id);

-- ============================
-- TABLA: PLANES
-- ============================



CREATE TABLE planes (
    id UUID PRIMARY KEY,
    nombre TEXT NOT NULL,
    max_proyectos INT,
    max_despliegues_mes INT,
    max_vps INT,
    max_almacenamiento_gb INT,
    max_anchobanda_gb INT,
    precio_mensual INT,
    precio_anual INT,
    caracteristicas TEXT[] DEFAULT ARRAY[]::TEXT[],
    activo BOOLEAN DEFAULT TRUE
);

-- ============================
-- TABLA: SUSCRIPCIONES
-- ============================

CREATE TABLE suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES planes(id) ON DELETE SET NULL,

    estado TEXT CHECK (estado IN ('activo','cancelado','vencido','prueba')) DEFAULT 'activo',

    periodo_inicio TIMESTAMPTZ,
    periodo_fin TIMESTAMPTZ,

    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,

    creado_en TIMESTAMPTZ DEFAULT NOW(),
    cancelado_en TIMESTAMPTZ
);