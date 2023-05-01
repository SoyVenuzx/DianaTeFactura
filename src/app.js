import express from 'express'

import './config.js'
import clientesRoutes from './routes/clientes.routes.js'
import proveedoresRoutes from './routes/proveedores.routes.js' 

const app = express()

// Middlewares
app.use(express.json())

// Routes
app.use('/api', clientesRoutes) 
app.use('/api', proveedoresRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' })
})

export default app
