DROP DATABASE DianaTeFactura;

CREATE DATABASE DianaTeFactura;

-- Productos
CREATE TABLE productos (
	IDProducto INT PRIMARY KEY AUTO_INCREMENT,
	nombreProducto VARCHAR(150) NOT NULL,
	precio DECIMAL(10, 2) NOT NULL CHECK (Precio >= 0),
	cantidadInventario INT NOT NULL CHECK (CantidadInventario >= 0),
	unidadMedida VARCHAR(20)
);

CREATE TABLE tipo_productos (
	IDTipo INT PRIMARY KEY AUTO_INCREMENT,
	Descripcion VARCHAR(100) NOT NULL,
	IDProducto INT,
	FOREIGN KEY (IDProducto) REFERENCES productos(IDProducto)
);

-- Contacto
CREATE TABLE contactosProveedor (
	idContacto int PRIMARY KEY AUTO_INCREMENT,
	tipoContacto varchar(50) NOT NULL,
	valor varchar(100) NOT NULL,
	idProveedor INT,
	FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor)
);

CREATE TABLE contactosCliente (
	idContacto INT PRIMARY KEY AUTO_INCREMENT
	tipoContacto VARCHAR(50) NOT NULL,
	valor VARCHAR(100) NOT NULL,
	idCliente INT,
	FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
)

-- Clientes
CREATE TABLE clientes (
	idCliente int PRIMARY KEY AUTO_INCREMENT,
	nombreCliente varchar(50) NOT NULL,
	apellidoCliente varchar(50) NOT NULL,
	FOREIGN KEY (idContacto) REFERENCES contactos(idContacto)
);

-- Ventas
CREATE TABLE ventas (
	IDVenta INT PRIMARY KEY AUTO_INCREMENT,
	Fecha DATETIME DEFAULT CURRENT_TIMESTAMP(),
	CantidadVendida INT NOT NULL,
	TotalVentas DECIMAL NOT NULL,
	IDProducto INT,
	IDCliente INT,
	FOREIGN KEY (IDProducto) REFERENCES productos(IDProducto),
	FOREIGN KEY (IDCliente) REFERENCES clientes(IDCliente)
);

CREATE TABLE tipo_ventas (
	IDTipoVenta INT PRIMARY KEY AUTO_INCREMENT,
	descripcion VARCHAR(100) NOT NULL,
	FOREIGN KEY (IDTipoVenta) REFERENCES ventas(IDVenta)
);

-- Proveedores
CREATE TABLE proveedores (
	idProveedor int PRIMARY KEY AUTO_INCREMENT,
	nombreProveedor varchar(50) NOT NULL,
	FOREIGN KEY (idContacto) REFERENCES contactos(idContacto)
);

-- Mapeo contactos
-- CREATE TABLE mapeo_contacto (
-- 	idMapeo int PRIMARY KEY AUTO_INCREMENT,
-- 	idContacto int NOT NULL,
-- 	idProveedor INT DEFAULT 0,
-- 	idCliente INT DEFAULT 0,
-- 	FOREIGN KEY (idContacto) REFERENCES contactos(idContacto),
-- 	FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor),
-- 	FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
-- );

-- Compras 
CREATE TABLE compras (
	IDCompra INT PRIMARY KEY AUTO_INCREMENT,
	Fecha DATETIME DEFAULT CURRENT_TIMESTAMP(),
	CantidadComprada INT NOT NULL,
	TotalCompra DECIMAL(10, 2) NOT NULL,
	IDProveedor INT,
	FOREIGN KEY (IDProveedor) REFERENCES proveedores(IDProveedor)
);

CREATE TABLE tipo_compras (
	IDTipoCompra INT PRIMARY KEY AUTO_INCREMENT,
	descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE compras_tipo_compras (
	IDCompra INT,
	IDTipoCompra INT,
	PRIMARY KEY (IDCompra, IDTipoCompra),
	FOREIGN KEY (IDCompra) REFERENCES compras(IDCompra),
	FOREIGN KEY (IDTipoCompra) REFERENCES tipo_compras(IDTipoCompra)
);

-- Inventario
CREATE TABLE inventario (
	IDInventario INT PRIMARY KEY AUTO_INCREMENT,
	IDProducto INT,
	CantidadDisponible INT NOT NULL,
	FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP(),
	descripcion VARCHAR(100) NOT NULL,
	cantidadEntrada INT NOT NULL,
	cantidadSalida INT NOT NULL,
	precioVenta DECIMAL(10, 2) NOT NULL,
	Total DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (IDProducto) REFERENCES productos(IDProducto)
);

-- Facturas
CREATE TABLE factura (
	idFactura INT PRIMARY KEY AUTO_INCREMENT,
	idCliente INT,
	fechaEmision DATETIME DEFAULT CURRENT_TIMESTAMP,
	estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
	total DECIMAL NOT NULL,
	FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
);

CREATE TABLE detalle_factura (
	idDetalleFactura INT PRIMARY KEY AUTO_INCREMENT,
	idFactura INT,
	idProductoVendido INT,
	cantidad INT NOT NULL,
	precioUnitario DECIMAL NOT NULL,
	totalDetalle DECIMAL NOT NULL,
	descripcion VARCHAR(150) NOT NULL,
	FOREIGN KEY (idFactura) REFERENCES factura(idFactura),
	FOREIGN KEY (idProductoVendido) REFERENCES productos(idProducto)
);

-- Usuarios
CREATE TABLE usuarios (
	IDUsuario int PRIMARY KEY AUTO_INCREMENT,
	nombreUsuario varchar(25) NOT NULL,
	contrasenia varchar(100) NOT NULL
);

CREATE TABLE informacion_usuario (
	IDUsuario int PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(25) NOT NULL,
	apellido varchar(25) NOT NULL,
	rol varchar(30) NOT NULL,
	correoElectronico varchar(50) NOT NULL,
	telefono varchar(20) NOT NULL,
	FOREIGN KEY (IDUsuario) REFERENCES usuarios(IDUsuario)
);

------------------------------------------------------------------------------
-- Ejemplos para crear proveedores/clientes/productos:
-- Insertando contacto
INSERT INTO
	contactos (tipoContacto, valor)
VALUES
	('email', 'proveedor3@ejemplo.com');

-- Insertando proveedor
INSERT INTO
	proveedores (nombreProveedor, idContacto)
VALUES
	('Proveedor 1', LAST_INSERT_ID());

-- Insertar mapeo
INSERT INTO
	mapeo_contacto (idContacto, idProveedor)
VALUES
	(LAST_INSERT_ID(), LAST_INSERT_ID());

------------------------------------------------------------------------------
-- Insertar un cliente
-- Insertar un contacto
INSERT INTO
	contactos (tipoContacto, valor)
VALUES
	('Email', 'cliente4@ejemplo.com');

-- Insertar un cliente y obtener su id
INSERT
	INT clientes (nombreCliente, apellidoCliente, idContacto)
VALUES
	('Antonio', 'Rodriguez', LAST_INSERT_ID());

-- Enlazar el contacto y el cliente mediante la tabla mapeo_contacto
INSERT INTO
	mapeo_contacto (idContacto, idCliente)
VALUES
	(LAST_INSERT_ID(), LAST_INSERT_ID());

------------------------------------------------------------------------------
-- Insertando productos
INSERT INTO
	productos (
		nombreProducto,
		precio,
		cantidadInventario,
		unidadMedida
	)
VALUES
	('Producto 1', 10.50, 100, 'pieza'),
	('Producto 2', 8.75, 50, 'kg');

-- Insertando tipos de productos
INSERT INTO
	tipo_productos (Descripcion, IDProducto)
VALUES
	('Tipo 1', 1),
	('Tipo 2', 2);