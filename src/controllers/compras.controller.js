import { pool } from '../db.js'

export const getPurchaseTypes = async (req, res) => {
  try {
    const query = `
      SELECT * FROM tipo_compras
    `

    const result = await pool.query(query)

    res.json(result[0])
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getPurchases = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.IDCompra, 
        c.fechaCompra, 
        c.totalCompra, 
        tc.descripcion AS TipoCompra, 
        dc.IDProducto, 
        dc.cantidadComprada
      FROM 
        compras c
        INNER JOIN tipo_compras tc ON c.IDTipoCompra = tc.IDTipoCompra
        INNER JOIN detalles_compra dc ON c.IDCompra = dc.IDCompra
    `

    const [result] = await pool.query(query)

    console.log({ result })

    const purchases = {}
    result.forEach(row => {
      const { IDCompra, fecha, totalCompra, tipoCompra, IDProducto, cantidadComprada } = row

      if (!purchases[IDCompra]) {
        purchases[IDCompra] = {
          IDCompra,
          fecha,
          totalCompra,
          tipoCompra,
          detalles: []
        }
      }

      purchases[IDCompra].detalles.push({
        IDProducto,
        cantidadComprada
      })
    })

    const purchasesArray = Object.values(purchases)

    res.json(purchasesArray)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createPurchaseType = async (req, res) => {
  try {
    const { descripcion } = req.body

    const query = `
      INSERT INTO tipo_compras (descripcion) VALUES (?)
    `

    const [result] = await pool.query(query, [descripcion])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al crear el tipo de compra' })
    }

    res.json({ message: 'Tipo de compra creado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const createPurchase = async (req, res) => {
  try {
    const {
      IDTipoCompra,
      IDProveedor,
      detalles
    } = req.body

    const query = `
      INSERT INTO compras (IDProveedor, IDTipoCompra, totalCompra) VALUES (?, ?, ?)
    `
    const [result] = await pool.query(query, [IDProveedor, IDTipoCompra, 0])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al crear la compra' })
    }

    const idCompra = result.insertId
    let totalCompra = 0

    detalles.forEach(async detalle => {
      const { IDProducto, cantidadComprada } = detalle

      const queryGetPrecioUnitario = `
        SELECT precio FROM productos WHERE IDProducto = ?
      `

      const [resultPrecio] = await pool.query(queryGetPrecioUnitario, [
        IDProducto
      ])

      const { precio } = resultPrecio[0]

      const queryInsertDetalle = `
        INSERT INTO detalles_compra (IDCompra, IDProducto, cantidadComprada) VALUES (?, ?, ?)
      `

      await pool.query(queryInsertDetalle, [
        idCompra,
        IDProducto,
        cantidadComprada
      ])

      const subtotal = parseFloat(cantidadComprada) * parseFloat(precio)
      totalCompra += subtotal

      if (detalles.indexOf(detalle) === detalles.length - 1) {
        const queryUpdateTotalCompra = `
          UPDATE compras SET totalCompra = ? WHERE IDCompra = ?
        `

        const [result] = await pool.query(queryUpdateTotalCompra, [totalCompra, idCompra])

        if (result.affectedRows === 0) {
          return res.status(500).json({ message: 'Error al actualizar la compra' })
        }
      }
    })

    res.json({ message: 'Compra creada correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getPurchase = async (req, res) => {
  try {
    const { id: idCompra } = req.params

    const query = `
      SELECT
        c.IDCompra,
        c.fechaCompra,
        c.totalCompra,
        tc.descripcion AS TipoCompra,
        dc.IDProducto,
        dc.cantidadComprada
      FROM
        compras c
        INNER JOIN tipo_compras tc ON c.IDTipoCompra = tc.IDTipoCompra
        INNER JOIN detalles_compra dc ON c.IDCompra = dc.IDCompra
      WHERE
        c.IDCompra = ?
    `

    const [result] = await pool.query(query, [idCompra])

    const purchase = {
      IDCompra: result[0].IDCompra,
      fechaCompra: result[0].fechaCompra,
      totalCompra: result[0].totalCompra,
      tipoCompra: result[0].TipoCompra,
      detalles: result.map(detalle => ({
        IDProducto: detalle.IDProducto,
        cantidadComprada: detalle.cantidadComprada
      }))
    }

    res.json(purchase)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updatePurchase = async (req, res) => {
  try {
    const { id: idCompra } = req.params

    const {
      IDTipoCompra,
      IDProveedor,
      detalles
    } = req.body

    const queryUpdateCompra = `
      UPDATE compras SET IDTipoCompra = ?, IDProveedor = ? WHERE IDCompra = ?
    `

    const [result] = await pool.query(queryUpdateCompra, [
      IDTipoCompra,
      IDProveedor,
      idCompra
    ])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al actualizar la compra' })
    }

    const queryDeleteDetalles = `
      DELETE FROM detalles_compra WHERE IDCompra = ?
    `

    await pool.query(queryDeleteDetalles, [idCompra])

    detalles.forEach(async detalle => {
      const { IDProducto, cantidadComprada } = detalle

      const queryInsertDetalle = `
        INSERT INTO detalles_compra (IDCompra, IDProducto, cantidadComprada) VALUES (?, ?, ?)
      `

      await pool.query(queryInsertDetalle, [
        idCompra,
        IDProducto,
        cantidadComprada
      ])

      if (detalles.indexOf(detalle) === detalles.length - 1) {
        const queryUpdateTotalCompra = `
          UPDATE compras SET totalCompra = ? WHERE IDCompra = ?
        `

        const [result] = await pool.query(queryUpdateTotalCompra, [0, idCompra])

        if (result.affectedRows === 0) {
          return res.status(500).json({ message: 'Error al actualizar la compra' })
        }
      }

      res.json({ message: 'Compra actualizada correctamente' })
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deletePurchase = async (req, res) => {
  try {
    const { id: idCompra } = req.params

    const queryDetails = `
    DELETE FROM detalles_compra WHERE IDCompra = ?
    `
    const [result] = await pool.query(queryDetails, [idCompra])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al eliminar la compra' })
    }

    const queryPurchase = `
      DELETE FROM compras WHERE IDCompra = ?
    `

    await pool.query(queryPurchase, [idCompra])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al eliminar la compra' })
    }

    res.json({ message: 'Compra eliminada correctamente' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
