import { pool } from '../db.js'

export const getClients = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM clientes')
    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getClient = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(
      'SELECT * FROM clientes WHERE IDCliente= ?',
      [id]
    )
    res.json(result[0])
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
