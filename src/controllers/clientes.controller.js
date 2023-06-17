import { formatName } from '../../utils/formatName.utils.js'
import { pool } from '../db.js'

export const getClients = async (req, res) => {
  try {
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
        LEFT JOIN contactosCliente c ON cl.idCliente = c.idCliente
        ORDER BY cl.idCliente
    `

    const [results] = await pool.query(query)

    const clients = []
    let currentClienteId = null
    let currentCliente = null

    results.forEach(row => {
      const {
        idCliente,
        nombreCliente,
        apellidoCliente,
        idContacto,
        tipoContacto,
        valor
      } = row

      if (idCliente !== currentClienteId) {
        currentClienteId = idCliente

        currentCliente = {
          idCliente,
          nombreCliente: formatName(nombreCliente, apellidoCliente),
          contactos: []
        }

        clients.push(currentCliente)
      }

      if (idContacto) {
        const contacto = {
          idContacto,
          tipoContacto,
          valor
        }

        currentCliente.contactos.push(contacto)
      }
    })

    res.json(clients)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getClient = async (req, res) => {
  try {
    const { id: idCliente } = req.params

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
        INNER JOIN contactosCliente c ON cl.idCliente = c.idCliente
      WHERE
        cl.idCliente = ?
    `

    const [result] = await pool.query(query, [idCliente])

    const client = {
      idCliente: result[0].idCliente,
      nombreCliente: formatName(
        result[0].nombreCliente,
        result[0].apellidoCliente
      ),
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
      const queryInsertCliente = `
        INSERT INTO clientes (nombreCliente, apellidoCliente) VALUES (?, ?)
      `

      const [resultCliente] = await pool.query(queryInsertCliente, [
        nombreCliente,
        apellidoCliente
      ])

      idCliente = resultCliente.insertId
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el cliente' })
    }

    try {
      const insertContactQuery =
        'INSERT INTO contactosCliente (tipoContacto, valor, idCliente) VALUES ?'

      const contactoValues = contactos.map(contacto => [
        contacto.tipoContacto,
        contacto.valor,
        idCliente
      ])

      await pool.query(insertContactQuery, [contactoValues])
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el contacto' })
    }

    res.json({ message: 'Cliente creado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editClient = async (req, res) => {
  const { id: idCliente } = req.params
  const { nombreCliente, apellidoCliente, contactos } = req.body

  try {
    // Actualizar el cliente
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

    // Eliminar los contactos existentes del cliente
    const deleteContactosQuery = `
      DELETE FROM contactosCliente
      WHERE idCliente = ?
    `
    await pool.query(deleteContactosQuery, [idCliente])

    // Insertar los nuevos contactos del cliente
    const insertContactQuery = `
      INSERT INTO contactosCliente (tipoContacto, valor, idCliente) VALUES ?
    `

    const contactosValues = contactos.map(contacto => [
      contacto.tipoContacto,
      contacto.valor,
      idCliente
    ])

    await pool.query(insertContactQuery, [contactosValues])

    res.json({ message: 'Cliente actualizado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteClient = async (req, res) => {
  try {
    const { id: idCliente } = req.params

    const queryDeleteContactos = `
      DELETE FROM contactosCliente
      WHERE idCliente = ?
    `

    await pool.query(queryDeleteContactos, [idCliente])

    const queryDeleteCliente = `
      DELETE FROM clientes
      WHERE idCliente = ?
    `

    await pool.query(queryDeleteCliente, [idCliente])

    res.json({ message: 'Cliente eliminado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
