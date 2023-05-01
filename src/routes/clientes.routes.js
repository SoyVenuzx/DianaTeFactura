import { Router } from 'express'
import { getClient, getClients } from '../controllers/clientes.controller.js'

const router = new Router()

// Clientes Routes 
router.get('/clientes', getClients)
router.get('/clientes/:id', getClient)

export default router
