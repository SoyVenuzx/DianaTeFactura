import { pool } from '../db.js'

export const getSuppliers = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.idProveedor,
        p.nombreProveedor,
        c.idContacto,
        c.tipoContacto,
        c.valor
      FROM 
        proveedores p
        LEFT JOIN contactosProveedor c ON p.idProveedor = c.idProveedor
        ORDER BY p.idProveedor
    `

    const [results] = await pool.query(query)

    const suppliers = []
    let currentSupplierId = null
    let currentSupplier = null

    results.forEach(row => {
      const { idProveedor, nombreProveedor, idContacto, tipoContacto, valor } = row

      if (idProveedor !== currentSupplierId) {
        currentSupplierId = idProveedor

        currentSupplier = {
          idProveedor,
          nombreProveedor,
          contactos: []
        }

        suppliers.push(currentSupplier)
      }

      if (idContacto) {
        const contacto = {
          idContacto,
          tipoContacto,
          valor
        }

        currentSupplier.contactos.push(contacto)
      }
    })

    res.json(suppliers)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getSupplier = async (req, res) => {
  try {
    const { id: idProveedor } = req.params

    const query = `
      SELECT
        p.idProveedor,
        p.nombreProveedor,
        c.idContacto,
        c.tipoContacto,
        c.valor
      FROM 
        proveedores p
        INNER JOIN contactosProveedor c on p.idProveedor = c.idProveedor
      WHERE 
        p.idProveedor = ?
    `

    const [result] = await pool.query(query, [idProveedor])

    const supplier = {
      idProveedor: result[0].idProveedor,
      nombreProveedor: result[0].nombreProveedor,
      contactos: result.map(contacto => ({
        idContacto: contacto.idContacto,
        tipoContacto: contacto.tipoContacto,
        valor: contacto.valor
      }))
    }

    res.json(supplier)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createSupplier = async (req, res) => {
  try {
    const { nombreProveedor, contactos } = req.body

    let idProveedor = ''

    try {
      const queryInsertProveedor =
        'INSERT INTO proveedores (nombreProveedor) VALUES (?)'

      const [resultProveedor] = await pool.query(queryInsertProveedor, [
        nombreProveedor
      ])

      idProveedor = resultProveedor.insertId
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el proveedor' })
    }

    try {
      const insertContactQuery =
        'INSERT INTO contactosProveedor (tipoContacto, valor, idProveedor) VALUES ?'

      const contactoValues = contactos.map(contacto => [
        contacto.tipoContacto,
        contacto.valor,
        idProveedor
      ])

      await pool.query(insertContactQuery, [contactoValues])
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el contacto' })
    }

    res.json({ message: 'Proveedor creado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editSupplier = async (req, res) => {
  const { id: idProveedor } = req.params
  const { nombreProveedor, contactos } = req.body

  try {
    // Actualizar el proveedor
    const updateProveedorQuery =
      'UPDATE proveedores SET nombreProveedor = ? WHERE idProveedor = ?'
    await pool.query(updateProveedorQuery, [nombreProveedor, idProveedor])

    // Eliminar los contactos existentes del proveedor
    const deleteContactosQuery =
      'DELETE FROM contactosProveedor WHERE idProveedor = ?'
    await pool.query(deleteContactosQuery, [idProveedor])

    // Insertar los nuevos contactos del proveedor
    const insertContactosQuery =
      'INSERT INTO contactosProveedor (tipoContacto, valor, idProveedor) VALUES ?'

    const contactoValues = contactos.map(contacto => [
      contacto.tipoContacto,
      contacto.valor,
      idProveedor
    ])

    await pool.query(insertContactosQuery, [contactoValues])

    res.json({ message: 'Proveedor actualizado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteSupplier = async (req, res) => {
  try {
    const { id: idProveedor } = req.params

    // Eliminar contactos asociados al proveedor
    const queryDeleteContactos = `
      DELETE FROM contactosProveedor 
      WHERE idProveedor = ? 
    `

    await pool.query(queryDeleteContactos, [idProveedor])

    const queryDeleteProveedor = `
      DELETE FROM proveedores
      WHERE idProveedor = ?
    `

    await pool.query(queryDeleteProveedor, [idProveedor])

    res.json({ message: 'Proveedor eliminado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
