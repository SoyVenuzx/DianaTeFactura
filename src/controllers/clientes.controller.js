import { pool } from '../db.js'

export const getClients = async (req, res) => {
  try {
    const query = `
      SELECT 
        cl.idProveedor,
        cl.nombreProveedor,
        c.idContacto,
        c.tipoContacto,
        c.valor
      FROM 
        clientes cl
        INNER JOIN contactosCliente c ON cl.idContacto = c.idContacto
    `

    const [result] = await pool.query(query)

    const clientes = {}
    result.forEach(row => {
      const {
        idCliente,
        nombreCliente,
        apellidoCliente,
        idContacto,
        tipoContacto,
        valor
      } = row

      if (!clientes[idCliente]) {
        clientes[idCliente] = {
          idCliente,
          nombreCliente,
          apellidoCliente,
          contactos: []
        }
      }

      clientes[idCliente].contactos.push({
        idContacto,
        tipoContacto,
        valor
      })

      res.json(Object.values(clientes))
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getClient = async (req, res) => {
  try {
    const { idCliente } = req.params

    const query = `
      SELECT
        cl.idCliente,
        cl.nombreCliente,
        cl.apellidoCliente,
        c.idContacto,
        c.tipoContacto,
        c.valor
      FROM
        clientes cl
        INNER JOIN contactosCliente c ON cl.idContacto = c.idContacto
      WHERE
        cl.idCliente = ?
    `

    const [result] = await pool.query(query, [idCliente])

    const client = {
      idCliente: result[0].idCliente,
      nombreCliente: result[0].nombreCliente,
      apellidoCliente: result[0].apellidoCliente,
      contactos: result.map(contacto => ({
        idContacto: contacto.idContacto,
        tipoContacto: contacto.tipoContacto,
        valor: contacto.valor
      }))
    }

    res.json(client)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createClient = async (req, res) => {
  try {
    const { nombreCliente, apellidoCliente, contactos } = req.body

    let idCliente = ''

    try {
      const queryCreateCliente = `
        INSERT INTO clientes (nombreCliente, apellidoCliente) VALUES (?, ?)
      `

      const [result] = await pool.query(queryCreateCliente, [
        nombreCliente,
        apellidoCliente
      ])

      idCliente = result.insertId
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el cliente' })
    }

    try {
      const insertContactQuery =
        'INSERT INTO contactosCliente (tipoContacto, valor, idCliente) VALUES (?, ?)'

      const contactoValues = contactos.map(contacto => [
        contacto.tipoContacto,
        contacto.valor,
        idCliente
      ])

      await pool.query(insertContactQuery, [contactoValues])
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el contacto' })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editClient = async (req, res) => {
  try {
    const { idCliente } = req.params
    const { nombreCliente, apellidoCliente, contactos } = req.body

    const queryUpdateCliente = `
      UPDATE clientes
      SET nombreCliente = ?, apellidoCliente = ?
      WHERE idCliente = ?
    `

    await pool.query(queryUpdateCliente, [
      nombreCliente,
      apellidoCliente,
      idCliente
    ])

    const queryGetContactos = `
      SELECT idContacto
      FROM contactosCliente
      WHERE idCliente = ?
    `

    const [existingContactos] = await pool.query(queryGetContactos, [idCliente])

    const existingContactosSet = new Set(
      existingContactos.map(({ idContacto }) => idContacto)
    )

    const contactosToDelete = existingContactosSet.filter(({ idContacto }) => {
      return !contactos.some(contacto => contacto.idContacto === idContacto)
    })

    if (contactosToDelete.length > 0) {
      const queryDeleteContactos = `
        DELETE FROM contactosCliente
        WHERE idContacto IN (${contactosToDelete
          .map(({ idContacto }) => idContacto)
          .join(',')})
      `

      console.log({ queryDeleteContactos })

      await pool.query(queryDeleteContactos)
    }

    const queryUpsertContactos = `
      INSERT INTO contactosCliente (tipoContacto, valor, idCliente)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE tipoContacto = VALUES(tipoContacto), valor = VALUES(valor)
    `

    const contactosValues = contactos.map(
      ({ idContacto, tipoContacto, valor }) => [
        idContacto,
        tipoContacto,
        valor,
        idCliente
      ]
    )

    await pool.query(queryUpsertContactos, contactosValues)

    res.json({ message: 'Cliente actualizado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteClient = async (req, res) => {
  try {
    const { idCliente } = req.params

    const queryDeleteCliente = `
      DELETE FROM clientes
      WHERE idCliente = ?
    `

    await pool.query(queryDeleteCliente, [idCliente])

    const queryDeleteContactos = `
      DELETE FROM contactosCliente
      WHERE idCliente = ?
    `

    await pool.query(queryDeleteContactos, [idCliente])

    res.json({ message: 'Cliente eliminado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
