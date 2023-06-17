import { pool } from '../db.js'

export const getProducts = async (rq, res) => {
  try {
    const query =
      'SELECT p.*, tp.descripcion AS tipoProducto FROM productos p LEFT JOIN tipo_productos tp ON p.IDProducto = tp.IDProducto'
    const [result] = await pool.query(query)

    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(
      'SELECT p.*, tp.descripcion AS tipoProducto FROM productos p LEFT JOIN tipo_productos tp ON p.IDProducto = tp.IDProducto WHERE p.IDProducto = ?',
      [id]
    )

    if (result.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json(result[0])
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createProduct = async (req, res) => {
  try {
    const {
      nombreProducto,
      precio,
      cantidadInventario,
      unidadMedida,
      tipoProducto
    } = req.body

    // Crear producto
    const queryInsertProducto = `
      INSERT INTO productos (
        nombreProducto, 
        precio, 
        cantidadInventario, 
        unidadMedida 
      ) VALUES (?, ?, ?, ?)
    `

    const [resultProducto] = await pool.query(queryInsertProducto, [
      nombreProducto,
      precio,
      cantidadInventario,
      unidadMedida
    ])

    const idProducto = resultProducto.insertId

    // Insertar tipo de producto
    const queryInsertTipoProducto =
      'INSERT INTO tipo_productos (descripcion, IDProducto) VALUES (?, ?)'
    await pool.query(queryInsertTipoProducto, [tipoProducto, idProducto])

    res.json({
      message: 'Producto creado exitosamente'
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const {
      nombreProducto,
      precio,
      cantidadInventario,
      unidadMedida
    } = req.body

    // Actualizar producto
    const queryUpdateProducto =
      'UPDATE productos SET nombreProducto = ?, precio = ?, cantidadInventario = ?, unidadMedida = ? WHERE IDProducto = ?'
    const [resultUpdateProducto] = await pool.query(queryUpdateProducto, [
      nombreProducto,
      precio,
      cantidadInventario,
      unidadMedida,
      id
    ])

    if (resultUpdateProducto.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json({
      message: 'Producto actualizado exitosamente'
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // Eliminar producto
    const queryDeleteProducto = 'DELETE FROM productos WHERE IDProducto = ?'
    const [resultDeleteProducto] = await pool.query(queryDeleteProducto, [id])

    if (resultDeleteProducto.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
