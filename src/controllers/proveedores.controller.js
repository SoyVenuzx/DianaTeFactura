import { pool } from '../db.js'

export const getSuppliers = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT p.idProveedor, p.nombreProveedor, c.tipoContacto, c.valor FROM proveedores p INNER JOIN contactos c ON p.idContacto = c.idContacto'
    )

    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getSupplier = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(
      'SELECT p.idProveedor, p.nombreProveedor, c.tipoContacto, c.valor FROM proveedores p INNER JOIN contactos c ON p.idContacto = c.idContacto WHERE p.idProveedor = ?',
      [id]
    )

    if (result.length === 0)
      return res.status(404).json({ message: 'Proveedor no encontrado' })

    res.json(result[0])
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
