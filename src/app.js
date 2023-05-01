import express from 'express'

import './config.js'
import clientesRoutes from './routes/clientes.routes.js'

const app = express()

// Middlewares
app.use(express.json())

// Routes
app.use('/api', clientesRoutes) 

// 404
app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' })
})

export default app
