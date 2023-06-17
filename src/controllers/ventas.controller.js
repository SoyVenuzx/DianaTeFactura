import { pool } from '../db.js'

export const getTypesSales = async (req, res) => {
  try {
    const query = 'SELECT * FROM tipo_ventas'

    const [result] = await pool.query(query)

    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createTypeSale = async (req, res) => {
  try {
    const { descripcion } = req.body

    const queryInsertTypeSale = 'INSERT INTO tipo_ventas (descripcion) VALUES (?)'

    const [result] = await pool.query(queryInsertTypeSale, [descripcion])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al crear el tipo de venta' })
    }

    res.json({ message: 'Tipo de venta creado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getSales = async (req, res) => {
  try {
    const query = `
      SELECT
        v.IDVenta AS IDVenta,
        v.cantidadVendida AS CantidadVendida,
        v.montoTotal AS MontoTotal,
        tv.descripcion AS TipoVenta,
        p.nombreProducto AS Producto,
        CONCAT(c.nombreCliente, ' ', c.apellidoCliente) AS Cliente
      FROM ventas v
        INNER JOIN tipo_ventas tv ON v.IDTipoVenta = tv.IDTipoVenta
        INNER JOIN productos p ON v.IDProducto = p.IDProducto
        INNER JOIN clientes c ON v.IDCliente = c.IDCliente
    `

    const [result] = await pool.query(query)

    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getSale = async (req, res) => {
  try {
    const { id: idVenta } = req.params

    const query = `
      SELECT
        v.IDVenta AS IDVenta,
        v.cantidadVendida AS CantidadVendida,
        v.montoTotal AS MontoTotal,
        tv.descripcion AS TipoVenta,
        p.nombreProducto AS Producto,
        CONCAT(c.nombreCliente, ' ', c.apellidoCliente) AS Cliente
      FROM ventas v
        INNER JOIN tipo_ventas tv ON v.IDTipoVenta = tv.IDTipoVenta
        INNER JOIN productos p ON v.IDProducto = p.IDProducto
        INNER JOIN clientes c ON v.IDCliente = c.IDCliente
      WHERE v.IDVenta = ?
    `

    const [result] = await pool.query(query, [idVenta])

    res.json(result[0])
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createSale = async (req, res) => {
  try {
    const {
      IDTipoVenta,
      cantidadVendida,
      montoTotal,
      IDProducto,
      IDCliente
    } = req.body

    // Crear venta
    const queryInsertSale = `
      INSERT INTO ventas (
        IDTipoVenta,
        cantidadVendida,
        montoTotal,
        IDProducto,
        IDCliente
      ) VALUES (?, ?, ?, ?, ?)
    `

    const [resultSale] = await pool.query(queryInsertSale, [
      IDTipoVenta,
      cantidadVendida,
      montoTotal,
      IDProducto,
      IDCliente
    ])

    if (resultSale.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al crear la venta' })
    }

    res.json({ message: 'Venta creada correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const editSale = async (req, res) => {
  try {
    const { id: idVenta } = req.params
    const {
      IDTipoVenta,
      cantidadVendida,
      montoTotal,
      IDProducto,
      IDCliente
    } = req.body

    // Editar venta
    const queryUpdateSale = `
      UPDATE ventas SET
        IDTipoVenta = ?,
        cantidadVendida = ?,
        montoTotal = ?,
        IDProducto = ?,
        IDCliente = ?
      WHERE IDVenta = ?
    `

    const [resultSale] = await pool.query(queryUpdateSale, [
      IDTipoVenta,
      cantidadVendida,
      montoTotal,
      IDProducto,
      IDCliente,
      idVenta
    ])

    if (resultSale.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al editar la venta' })
    }

    res.json({ message: 'Venta editada correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deletSale = async (req, res) => {
  try {
    const { id: idVenta } = req.params

    const query = 'DELETE FROM ventas WHERE IDVenta = ?'

    const [result] = await pool.query(query, [idVenta])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al eliminar la venta' })
    }

    res.json({ message: 'Venta eliminada correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
