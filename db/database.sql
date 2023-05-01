IF EXISTS (SELECT * FROM sys.databases WHERE name = 'DianaTeFactura')
BEGIN
  DROP DATABASE DianaTeFactura;
END

CREATE DATABASE DianaTeFactura;

create table productos (
	IDProductos int primary key auto_increment,
	NombreProducto varchar(150) not null,
	Precio decimal not null,
	CantidadInventario int not null
);

create table tipo_productos (
	IDTipoProductos int primary key auto_increment,
	descripcion varchar(100) not null,
	foreign key (IDTipoProductos) references productos(IDProductos)
);

create table ventas (
	IDVentas int primary key auto_increment,
	Fecha datetime default current_timestamp(),
	CantidadVendida int not null,
	TotalVentas decimal not null,
	IDProductos int,
	foreign key (IDProductos) references productos(IDProductos)
);

create table tipo_ventas (
	IDTipoVenta  int primary key auto_increment,
	descripcion varchar(100) not null,
	foreign key (IDTipoVenta) references ventas(IDVentas)
);

create table proveedores (
	IDProveedor int primary key auto_increment,
	NombreProveedor varchar(50) not null,
	Email varchar(50) not null,
	Contacto int not null
);

create table compras (
	IDCompra int primary key auto_increment,
	Fecha datetime default current_timestamp(), 
	CantidadComprada int not null,
	TotalCompra decimal not null,
	IDProveedor int,
	foreign key (IDProveedor) references proveedores(IDProveedor)
);

create table tipo_compras (
	IDTipoCompra int primary key auto_increment,
	descripcion varchar(100) not null,
	foreign key (IDTipoCompra) references compras(IDCompra)
);

create table inventario (
	IDInventario int primary key auto_increment,
	IDProductos int,
	CantidadDisponible int not null,
	FechaRegistro datetime default current_timestamp(),
	descripcion varchar(100) not null,
	cantidadEntrda int not null,
	cantidadSalida int not null,
	precioVenta decimal not null,
	Total decimal not null,
	foreign key (IDProductos) references productos(IDProductos)
);

create table clientes (
	IDCliente int primary key auto_increment,
	NombreCliente varchar(50) not null,
	ApellidoCliente varchar(50) not null
);

create table contacto (
	IDContacto int primary key auto_increment,
	descripcion varchar(50) not null,
	valor varchar(100) not null,
	IDCliente int,
	FOREIGN KEY (IDCliente) REFERENCES clientes(IDCliente)
);

create table facturas (
	IDFacturas int primary key auto_increment,
	IDCliente int, 
	FechaEmision datetime default current_timestamp(),
	TotalFactura decimal not null,
	foreign key (IDCliente) references clientes(IDCliente)
);

create table detalles_factura (
	IDdetalle_factura int primary key auto_increment,
	IDFacturas int, 
	IDProducto int,
	Cantidad int not null,
	PrecioUnitario decimal not null,
	TotalDetalle decimal not null,
	descripcion varchar(150) not null
);

create table usuariosDiana (
	IDUsuario int primary key auto_increment,
	nombreUsuario varchar(25) not null,
	apellidoUsuario varchar(25) not null,
	posicion varchar(30) not null
);

-- INSERT INTO clientes (NombreCliente, ApellidoCliente)
-- VALUES 
-- ('Juan', 'Pérez'),
-- ('María', 'García');

-- SELECT * FROM clientes;

-- INSERT INTO contacto (descripcion, valor, IDCliente)
-- VALUES 
-- ('Teléfono', '1234567890', 1),
-- ('Dirección', 'Calle Falsa 123', 2);

-- SELECT * FROM contacto;
