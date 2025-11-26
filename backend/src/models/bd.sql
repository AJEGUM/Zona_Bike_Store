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
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    id_usuario INT,
    foreign key (id_usuario) references usuarios(id_usuario)
);

-- ===========================
--      TABLA USUARIOS
-- ===========================
INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES
('Carlos Pérez', 'carlos@gmail.com', '123', 1),
('Laura Gómez', 'laura@gmail.com', '123', 1),
('Marco Ruiz', 'marco@gmail.com', '123', 2),
('Daniel Torres', 'daniel@gmail.com', '123', 2),
('Ana López', 'ana@gmail.com', '123', 1),
('Sofía Ríos', 'sofia@gmail.com', '123', 2),
('Pedro Martínez', 'pedro@gmail.com', '123', 1),
('Juliana Castro', 'juliana@gmail.com', '123', 2),
('Felipe Ocampo', 'felipe@gmail.com', '123', 1),
('Roberto Vega', 'roberto@gmail.com', '123', 1),
('Valentina Mora', 'valen@gmail.com', '123', 2),
('Esteban Duque', 'esteban@gmail.com', '123', 2),
('Samuel Ortiz', 'samuel@gmail.com', '123', 1),
('Manuela Díaz', 'manuela@gmail.com', '123', 2),
('Paula Ríos', 'paula@gmail.com', '123', 1),
('Camilo López', 'camilo@gmail.com', '123', 1),
('Dayana Beltrán', 'dayana@gmail.com', '123', 2),
('Fernanda Silva', 'fer@gmail.com', '123', 1),
('Jorge Castillo', 'jorge@gmail.com', '123', 2),
('Andrea León', 'andrea@gmail.com', '123', 1);

-- ===========================
--     TABLA CATEGORIAS
-- ===========================
INSERT INTO categorias (nombre) VALUES
('Montaña'),
('Ruta'),
('Urbana'),
('Eléctrica'),
('BMX'),
('Híbrida'),
('Trail'),
('Enduro'),
('Downhill'),
('Gravel'),
('Infantil'),
('Fat Bike'),
('Triatlón'),
('Fixie'),
('Plegable'),
('Vintage'),
('Touring'),
('Cargo'),
('Dirt Jump'),
('Cross Country');

-- ===========================
--     TABLA MARCAS
-- ===========================
INSERT INTO marcas (nombre) VALUES
('Trek'),
('Giant'),
('Cannondale'),
('Specialized'),
('Scott'),
('Santa Cruz'),
('Yeti'),
('Merida'),
('GT'),
('Cube'),
('Bianchi'),
('Fuji'),
('Orbea'),
('Canyon'),
('Kona'),
('Lapierre'),
('Norco'),
('Ghost'),
('Mondraker'),
('Polygon');

-- ===========================
--       TABLA PRODUCTOS
-- ===========================
INSERT INTO productos (nombre, precio_venta, descripcion, imagen, estado, id_categoria, id_marca) VALUES
('Trek Marlin 7', 3200000, 'Bicicleta montaña aluminio', '', 'activo', 1, 1),
('Giant Talon 3', 2500000, 'Bicicleta montaña gama media', '', 'activo', 1, 2),
('Cannondale Quick 4', 2800000, 'Urbana ligera', '', 'activo', 3, 3),
('Specialized Rockhopper', 3500000, 'Montaña profesional', '', 'activo', 1, 4),
('Scott Speedster 20', 5200000, 'Ruta aluminio', '', 'activo', 2, 5),
('Santa Cruz 5010', 19000000, 'Enduro carbono', '', 'activo', 8, 6),
('Yeti ARC', 21000000, 'Trail alto rendimiento', '', 'activo', 7, 7),
('GT Avalanche', 2300000, 'Montaña básica', '', 'activo', 1, 9),
('Cube Nature Pro', 4200000, 'Híbrida de alta calidad', '', 'activo', 6, 10),
('Bianchi Sprint', 9500000, 'Ruta carbono', '', 'activo', 2, 11),
('Fuji Nevada', 2600000, 'Montaña media', '', 'activo', 1, 12),
('Orbea Alma H30', 4800000, 'XC aluminio', '', 'activo', 20, 13),
('Canyon Grail 6', 7800000, 'Gravel premium', '', 'activo', 10, 14),
('Kona Dew', 2300000, 'Urbana liviana', '', 'activo', 3, 15),
('Lapierre Pulsium', 11000000, 'Ruta avanzada', '', 'activo', 2, 16),
('Norco Fluid FS', 9500000, 'Trail full suspension', '', 'activo', 7, 17),
('Ghost Kato 3.9', 3900000, 'Montaña confiable', '', 'activo', 1, 18),
('Mondraker Chrono', 8500000, 'XC tope gama', '', 'activo', 20, 19),
('Polygon Siskiu D7', 4700000, 'Trail económica', '', 'activo', 7, 20),
('Trek FX 2', 3100000, 'Híbrida urbana', '', 'activo', 6, 1);

-- ===========================
--   STOCK PRODUCTOS
-- ===========================
INSERT INTO stock_productos (id_producto, cantidad) VALUES
(1, 15),(2, 20),(3, 12),(4, 10),(5, 8),
(6, 3),(7, 4),(8, 25),(9, 11),(10, 6),
(11, 18),(12, 9),(13, 7),(14, 22),(15, 5),
(16, 3),(17, 14),(18, 6),(19, 12),(20, 17);

-- ===========================
--        TABLA VENTAS
-- ===========================
INSERT INTO ventas (id_usuario, total) VALUES
(1, 3200000),(2, 2500000),(3, 9000000),(4, 4700000),(5, 7800000),
(6, 21000000),(7, 2300000),(8, 5200000),(9, 3100000),(10, 9500000),
(11, 2600000),(12, 4500000),(13, 3900000),(14, 4700000),(15, 11000000),
(16, 8500000),(17, 2300000),(18, 7800000),(19, 4800000),(20, 3200000);

-- ===========================
--        TABLA PAGOS
-- ===========================
INSERT INTO pagos (id_venta, numero_tarjeta, fecha_expiracion, cvv, ciudad, pais) VALUES
(1,'4556332290123345','12/29','121','Bogotá','Colombia'),
(2,'4211345590021765','05/28','889','Medellín','Colombia'),
(3,'4111443355338833','11/30','332','Cali','Colombia'),
(4,'5333441122991144','07/27','921','Bogotá','Colombia'),
(5,'4111223344556677','09/26','663','Barranquilla','Colombia'),
(6,'4444222211112222','10/30','778','Pereira','Colombia'),
(7,'4111998877552211','04/29','992','Manizales','Colombia'),
(8,'5454332211009988','03/28','345','Bogotá','Colombia'),
(9,'4322110099887766','06/27','110','Cali','Colombia'),
(10,'4556778899001122','12/29','224','Medellín','Colombia'),
(11,'4111665544332211','02/26','445','Bogotá','Colombia'),
(12,'5222441133557799','11/28','887','Cúcuta','Colombia'),
(13,'4556098877223311','09/27','554','Ibagué','Colombia'),
(14,'4111553322998877','07/29','663','Bogotá','Colombia'),
(15,'4988776655443322','08/30','190','Cali','Colombia'),
(16,'4333221100998877','10/28','417','Medellín','Colombia'),
(17,'4556332290123345','12/29','121','Bogotá','Colombia'),
(18,'4211345590021765','05/28','889','Medellín','Colombia'),
(19,'4111443355338833','11/30','332','Cali','Colombia'),
(20,'5333441122991144','07/27','921','Bogotá','Colombia');

-- ===========================
--      DETALLE VENTAS
-- ===========================
INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1,1,1,3200000),
(2,2,1,2500000),
(3,10,1,9500000),
(4,19,1,4700000),
(5,13,1,7800000),
(6,7,1,21000000),
(7,14,1,2300000),
(8,5,1,5200000),
(9,20,1,3100000),
(10,3,1,2800000),
(11,11,1,2600000),
(12,12,1,4500000),
(13,17,1,3900000),
(14,18,1,4700000),
(15,15,1,11000000),
(16,16,1,8500000),
(17,4,1,3500000),
(18,6,1,19000000),
(19,8,1,2300000),
(20,9,1,4200000);

-- ===========================
--      TABLA PROMOCIONES
-- ===========================
INSERT INTO promociones (titulo, descripcion, imagen, fecha_inicio, fecha_fin, estado, id_usuario) VALUES
('Promo Verano', 'Descuentos en bicis montaña', '', '2025-01-01','2025-01-15','activa',1),
('Ruta Week', 'Ofertas especiales en ruta', '', '2025-02-10','2025-02-20','activa',2),
('Gravel Fest', 'Precios bajos en gravel', '', '2025-03-05','2025-03-18','activa',3),
('Urbana Days', 'Descuentos en urbanas', '', '2025-04-01','2025-04-10','activa',4),
('Enduro Sale', 'Rebajas en enduro premium', '', '2025-04-15','2025-04-30','activa',5),
('Fin de Mes', 'Descuentos generales', '', '2025-05-01','2025-05-05','activa',6),
('Día del Ciclista', 'Promos especiales', '', '2025-06-01','2025-06-07','activa',7),
('Montaña Week', 'Ofertas MTB', '', '2025-06-15','2025-06-25','activa',8),
('Kids Week', 'Promo bicicletas infantiles', '', '2025-07-01','2025-07-10','activa',9),
('Electric Fest', 'Descuentos en eléctricas', '', '2025-07-15','2025-07-25','activa',10),
('Black Week', 'Promos fuertes', '', '2025-08-01','2025-08-08','activa',11),
('Super Sale', 'Descuentos varios', '', '2025-08-15','2025-08-25','activa',12),
('Off Road Fest', 'Trail & Enduro', '', '2025-09-01','2025-09-12','activa',13),
('Ruta Elite', 'Bicis de alto nivel', '', '2025-09-20','2025-09-30','activa',14),
('Noviembre Deals', 'Ofertas del mes', '', '2025-11-01','2025-11-10','activa',15),
('Navidad Riders', 'Promo navidad', '', '2025-12-01','2025-12-25','activa',16),
('Últimos Días', 'Cierre anual', '', '2025-12-20','2025-12-31','activa',17),
('Back to School', 'Ofertas escolares', '', '2025-01-10','2025-01-20','activa',18),
('Flash Sale', 'Descuentos rápidos', '', '2025-02-01','2025-02-02','activa',19),
('Mega Fest', 'Mega descuentos', '', '2025-03-10','2025-03-20','activa',20);
