import express from 'express'

import './config.js'
import clientesRoutes from './routes/clientes.routes.js'
import proveedoresRoutes from './routes/proveedores.routes.js'
import productosRoutes from './routes/productos.routes.js'
import ventasRoutes from './routes/ventas.routes.js'
import comprasRoutes from './routes/compras.routes.js'

const app = express()

// Middlewares
app.use(express.json())

// Routes
app.use('/api', clientesRoutes)
app.use('/api', proveedoresRoutes)
app.use('/api', productosRoutes)
app.use('/api', ventasRoutes)
app.use('/api', comprasRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' })
})

export default app
