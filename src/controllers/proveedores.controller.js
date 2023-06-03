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
        INNER JOIN contactosProveedor c ON p.idContacto = c.idContacto
    `

    const [result] = await pool.query(query)

    const proveedores = {}
    result.forEach(row => {
      const { idProveedor, nombreProveedor, idContacto, tipoContacto, valor } =
        row

      if (!proveedores[idProveedor]) {
        proveedores[idProveedor] = {
          idProveedor,
          nombreProveedor,
          contactos: []
        }
      }

      proveedores[idProveedor].contactos.push({
        idContacto,
        tipoContacto,
        valor
      })

      res.json(Object.values(proveedores))
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getSupplier = async (req, res) => {
  try {
    const { idProveedor } = req.params
    const query = `
      SELECT
        p.idProveedor,
        p.nombreProveedor,
        c.idContacto,
        c.tipoContacto,
        c.valor
      FROM 
        proveedores p
        INNER JOIN contactosProveedor c ON p.idContacto = c.idContacto
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
        'INSERT INTO contactosProveedor (tipoContacto, valor, idProveedor) VALUES (?, ?, ?)'

      const contactoValues = contactos.map(contacto => [
        contacto.tipoContacto,
        contacto.valor,
        idProveedor
      ])

      await pool.query(insertContactQuery, contactoValues)
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el contacto' })
    }

    res.json({ message: 'Proveedor creado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editSupplier = async (req, res) => {
  try {
    const { idProveedor } = req.params
    const { nombreProveedor, contactos } = req.body

    // Actualizar proveedor
    const queryUpdateProveedor = `
      UPDATE proveedores
      SET nombreProveedor = ?
      WHERE idProveedor = ?
    `

    await pool.query(queryUpdateProveedor, [nombreProveedor, idProveedor])

    // Obtener los contactos existentes del proveedor
    const queryGetContactos = `
      SELECT idContacto
      FROM contactosProveedor 
      WHERE idProveedor = ?
    `

    const [existingContactos] = await pool.query(queryGetContactos, [
      idProveedor
    ])

    // Conjunto de los IDs de los contactos existentes
    const existingContactosSet = new Set(
      existingContactos.map(({ idContacto }) => idContacto)
    )

    // Obtener los IDs de los contactos a eliminar
    const contactosToDelete = existingContactosSet.filter(({ idContacto }) => {
      return !contactos.some(contacto => contacto.idContacto === idContacto)
    })

    // Eliminar los contactos que ya no están en la lista de contactos actualizada
    if (contactosToDelete.length > 0) {
      const queryDeleteContactos = `
        DELETE FROM contactosProveedor 
        WHERE idContacto  IN (${contactosToDelete
          .map(({ idContacto }) => idContacto)
          .join(', ')})
      `

      console.log({ queryDeleteContactos })

      await pool.query(queryDeleteContactos)
    }

    // Insertar o actualizar los contactos
    const queryUpsertContactos = `
      INSERT INTO contactosProveedor (idContacto, tipoContacto, valor, idProveedor)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE tipoContacto = VALUES(tipoContacto), valor = VALUES(valor)
    `

    const contactosValues = contactos.map(
      ({ idContacto, tipoContacto, valor }) => [
        idContacto,
        tipoContacto,
        valor,
        idProveedor
      ]
    )

    await pool.query(queryUpsertContactos, contactosValues)

    res.json({ message: 'Proveedor actualizado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteSupplier = async (req, res) => {
  try {
    const { idProveedor } = req.params

    const queryDeleteProveedor = `
      DELETE FROM proveedores
      WHERE idProveedor = ?
    `

    await pool.query(queryDeleteProveedor, [idProveedor])

    // Eliminar contactos asociados al proveedor
    const queryDeleteContactos = `
      DELETE FROM contactosProveedor 
      WHERE idProveedor = ? 
    `

    await pool.query(queryDeleteContactos, [idProveedor])

    res.json({ message: 'Proveedor eliminado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
