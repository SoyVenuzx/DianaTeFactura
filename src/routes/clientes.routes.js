import { Router } from 'express'
import {
  createClient,
  deleteClient,
  editClient,
  getClient,
  getClients
} from '../controllers/clientes.controller.js'

const router = new Router()

// Clientes Routes
router.get('/clientes', getClients)
router.get('/clientes/:id', getClient)
router.delete('/clientes/:id', deleteClient)
router.post('/clientes/registrar', createClient)
router.put('/clientes/actualizar/:id', editClient)

export default router
