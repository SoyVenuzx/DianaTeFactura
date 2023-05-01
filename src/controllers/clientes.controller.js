import { pool } from '../db.js'

export const getClients = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT c.idCliente, c.nombreCliente, c.apellidoCliente, co.tipoContacto, co.valor FROM clientes c INNER JOIN contactos co ON c.idContacto = co.idContacto'
    )
    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getClient = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(
      'SELECT c.idCliente, c.nombreCliente, c.apellidoCliente, co.tipoContacto, co.valor FROM clientes c INNER JOIN contactos co ON c.idContacto = co.idContacto WHERE c.idCliente = ?',
      [id]
    )

    if (result.length === 0)
      return res.status(404).json({ message: 'Cliente no encontrado' })

    res.json(result[0])
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Ejemplo creacion proveedor/cliente con tabla contactos

// try {
//     const { nombreProveedor, contactos } = req.body; // Se espera recibir el nombre del proveedor y una lista de contactos

//     const result = await db.query('INSERT INTO proveedores (nombreProveedor) VALUES (?)', [nombreProveedor]);
//     const idProveedor = result.insertId;

//     // Insertamos los contactos
//     for (const contacto of contactos) {
//       const { descripcion, valor } = contacto;
//       const result = await db.query('INSERT INTO contacto (descripcion, valor) VALUES (?, ?)', [descripcion, valor]);
//       const idContacto = result.insertId;

//       // Insertamos el mapeo a la tabla de mapeo_contacto
//       await db.query('INSERT INTO mapeo_contacto (idProveedor, idContacto) VALUES (?, ?)', [idProveedor, idContacto]);
//     }

//     res.status(201).json({ message: 'Proveedor creado exitosamente' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Hubo un error al crear el proveedor' });
//   }

// try {
//   const { nombreCliente, apellidoCliente, contactos } = req.body; // Se espera recibir el nombre y apellido del cliente y una lista de contactos

//   const result = await db.query('INSERT INTO clientes (nombreCliente, apellidoCliente) VALUES (?, ?)', [nombreCliente, apellidoCliente]);
//   const idCliente = result.insertId;

//   // Insertamos los contactos
//   for (const contacto of contactos) {
//     const { descripcion, valor } = contacto;
//     const result = await db.query('INSERT INTO contacto (descripcion, valor) VALUES (?, ?)', [descripcion, valor]);
//     const idContacto = result.insertId;

//     // Insertamos el mapeo a la tabla de mapeo_contacto
//     await db.query('INSERT INTO mapeo_contacto (idCliente, idContacto) VALUES (?, ?)', [idCliente, idContacto]);
//   }

//   res.status(201).json({ message: 'Cliente creado exitosamente' });
// } catch (error) {
//   console.log(error);
//   res.status(500).json({ message: 'Hubo un error al crear el cliente' });
// }
