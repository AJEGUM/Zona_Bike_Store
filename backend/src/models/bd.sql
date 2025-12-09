create database zona_bike_store_db;
use zona_bike_store;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
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

CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    total DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    numero_tarjeta VARCHAR(20),
    fecha_expiracion VARCHAR(7),
    cvv VARCHAR(5),
    ciudad VARCHAR(100),
    pais VARCHAR(100),

    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE
);


CREATE TABLE detalle_ventas (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE promociones (
    id_promocion INT NOT NULL AUTO_INCREMENT primary key,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen LONGTEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    posicion_texto VARCHAR(50) DEFAULT 'centro',
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    id_usuario INT,
    foreign key (id_usuario) references usuarios(id_usuario)
);

CREATE TABLE recuperacion_clave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    expiracion DATETIME NOT NULL,
    usado TINYINT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) 
);