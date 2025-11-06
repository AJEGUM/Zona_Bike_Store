create database zona_bike_store;
use zona_bike_store;

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

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE
);

CREATE TABLE marcas (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE
);

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