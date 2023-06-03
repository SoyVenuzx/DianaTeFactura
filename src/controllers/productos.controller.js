import { pool } from '../db.js'

export const getProducts = async (rq, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM productos')

    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(
      'SELECT * FROM productos WHERE idProducto = ?',
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
    const { NombreProducto, Precio, CantidadInventario, UnidadMedida } =
      req.body

    // Crear producto
    const queryInsertProducto =
      'INSERT INTO productos (NombreProducto, Precio, CantidadInventario, UnidadMedida) VALUES (?, ?, ?, ?)'
    const [resultProducto] = await pool.query(queryInsertProducto, [
      NombreProducto,
      Precio,
      CantidadInventario,
      UnidadMedida
    ])

    const idProducto = resultProducto.insertId

    res.json({
      message: 'Producto creado exitosamente',
      producto: {
        idProducto,
        NombreProducto,
        Precio,
        CantidadInventario,
        UnidadMedida
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { NombreProducto, Precio, CantidadInventario, UnidadMedida } =
      req.body

    // Actualizar producto
    const queryUpdateProducto =
      'UPDATE productos SET NombreProducto = ?, Precio = ?, CantidadInventario = ?, UnidadMedida = ? WHERE idProducto = ?'
    const [resultUpdateProducto] = await pool.query(queryUpdateProducto, [
      NombreProducto,
      Precio,
      CantidadInventario,
      UnidadMedida,
      id
    ])

    if (resultUpdateProducto.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      producto: {
        idProducto: id,
        NombreProducto,
        Precio,
        CantidadInventario,
        UnidadMedida
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // Eliminar producto
    const queryDeleteProducto = 'DELETE FROM productos WHERE idProducto = ?'
    const [resultDeleteProducto] = await pool.query(queryDeleteProducto, [id])

    if (resultDeleteProducto.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
