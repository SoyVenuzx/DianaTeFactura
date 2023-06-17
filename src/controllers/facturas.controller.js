import { pool } from '../db.js'

export const createInvoice = async (req, res) => {
  try {
    const { idCliente, detalles } = req.body

    // Crear factura
    const queryInsertInvoice = `
      INSERT INTO factura (idCliente, total) VALUES (?, ?)
    `

    const [resultInvoice] = await pool.query(queryInsertInvoice, [idCliente, 0])

    const idFactura = resultInvoice.affectedRows

    let totalFactura = 0

    detalles.forEach(async detalle => {
      const { idProductoVendido, cantidad, precioUnitario, descripcion } = detalles

      const totalDetalle = cantidad * precioUnitario
      totalFactura += totalDetalle

      const queryInsertDetalle = `
        INSERT INTO detalle_factura (idFactura, idProductoVendido, cantidad, precioUnitario, totalDetalle, descripcion)
        VALUES (?, ?, ?, ?, ?, ?)
      `

      await pool.query(queryInsertDetalle, [
        idFactura,
        idProductoVendido,
        cantidad,
        precioUnitario,
        totalDetalle,
        descripcion
      ])

      if (detalles.indexOf(detalle) === detalles.length - 1) {
        const queryUpdateTotal = `
          UPDATE factura SET TOTAL WHERE IDFactura = ?
        `

        const [result] = await pool.query(queryUpdateTotal, [totalFactura, idFactura])

        if (result.affectedRows === 0) {
          return res.status(500).json({ message: 'Error al actualizar la factura' })
        }
      }

      res.json({ message: 'Factura creada exitosamente' })
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
