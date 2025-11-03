create database clinica;
use clinica;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE permisos (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE rol_permiso (
    id_rol_permiso INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT,
    permiso_id INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id_permiso)
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(300),
    clave VARCHAR(500),
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Insertar roles
INSERT INTO roles (nombre) VALUES 
('Administrador'),
('Empleado');

-- Insertar permisos
INSERT INTO permisos (nombre, descripcion) VALUES
('Crear', 'Permite crear nuevos registros'),
('Leer', 'Permite visualizar registros'),
('Actualizar', 'Permite modificar registros existentes'),
('Eliminar', 'Permite eliminar registros');

-- Asignar permisos al rol Administrador (id_rol = 1)
INSERT INTO rol_permiso (id_rol, permiso_id) VALUES
(1, 1), -- Crear
(1, 2), -- Leer
(1, 3), -- Actualizar
(1, 4); -- Eliminar

-- Asignar permisos al rol Empleado (id_rol = 2), solo Leer
INSERT INTO rol_permiso (id_rol, permiso_id) VALUES
(2, 2);

-- Insertar usuario Admin (contraseña: 123456)
INSERT INTO usuarios (nombre, email, clave, id_rol)
VALUES 
('Admin', 'admin@gmail.com', '$2b$10$wLyuMd5mP.D5YekcUa2uSOQIRXvXFyKmpz3go/ryHgHU1ihTtioa6', 1); 
-- La contraseña es: 1

-- Insertar usuario Empleado (contraseña: 123456)
INSERT INTO usuarios (nombre, email, clave, id_rol)
VALUES 
('Empleado1', 'empleado@gmail.com', '$2b$10$wLyuMd5mP.D5YekcUa2uSOQIRXvXFyKmpz3go/ryHgHU1ihTtioa6', 2);
-- La contraseña es: 1

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE
);

INSERT INTO categorias (nombre) VALUES
('Bicicleta de Ruta'),
('Bicicleta de Montaña'),
('Bicicleta Gravel'),
('Bicicleta Eléctrica');

CREATE TABLE marcas (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE
);

INSERT INTO marcas (nombre) VALUES
('Specialized'),
('Trek'),
('Cannondale'),
('Canyon'),
('Scott'),
('BMC'),
('Giant');

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio_venta DECIMAL(10,2) CHECK (precio_venta >= 0),
    descripcion VARCHAR(500),
    imagen LONGTEXT,
    estado ENUM('activo', 'inactivo') default 'activo',
    id_categoria INT,
    id_marca INT,

    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

CREATE TABLE stock_productos (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,    
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);


INSERT INTO productos 
(nombre, precio_venta, descripcion, imagen, id_categoria, id_marca)
VALUES
('Specialized S-Works Tarmac SL8', 5800.00, 
 'Bicicleta de ruta tope de gama, cuadro de carbono FACT 12r y grupo Shimano Dura-Ace Di2.',
 'images/tarmac_sl8.jpg', 1, 1),

('Trek Émonda SLR 9', 6200.00, 
 'Bicicleta ultraligera para escalada, carbono OCLV y Shimano Dura-Ace electrónico.',
 'images/trek_emonda_slr9.jpg', 1, 2),

('Cannondale Scalpel Hi-MOD Ultimate', 9500.00, 
 'MTB de cross-country con carbono Hi-MOD y suspensión Lefty Ocho.',
 'images/scalpel_himod.jpg', 2, 3),

('Scott Spark RC World Cup EVO', 8900.00, 
 'MTB full suspension ganadora de Copa del Mundo, grupo SRAM XX1 AXS.',
 'images/scott_spark_rc_evo.jpg', 2, 5),

('Canyon Grizl CFR Di2', 5200.00, 
 'Bicicleta gravel de carbono CFR, ligera y rápida en largas distancias.',
 'images/canyon_grizl_cfr.jpg', 3, 4),

('BMC Roadmachine 01 ONE', 7800.00, 
 'Bicicleta de ruta endurance premium, carbono premium TCC y Dura-Ace Di2.',
 'images/bmc_roadmachine_01.jpg', 1, 6),

('Giant Propel Advanced SL 0', 7300.00,
 'Aero bike para velocidad máxima, carbono Advanced SL y SRAM Red AXS.',
 'images/giant_propel_sl0.jpg', 1, 7),

('Specialized S-Works Epic', 10200.00,
 'MTB XC ultra ligera con suspensión Brain y grupo XX1 AXS.',
 'images/sworks_epic.jpg', 2, 1),

('Trek Domane SLR 9 AXS', 7800.00,
 'Ruta endurance con IsoSpeed y SRAM RED AXS.',
 'images/domane_slr9.jpg', 1, 2),

('Canyon Spectral:ON CFR', 9000.00,
 'E-MTB eléctrica de carbono, motor Shimano EP8 y batería de larga duración.',
 'images/spectral_on_cfr.jpg', 4, 4);
