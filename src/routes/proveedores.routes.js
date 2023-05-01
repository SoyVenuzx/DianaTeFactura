import { Router } from 'express'
import { getSupplier, getSuppliers } from '../controllers/proveedores.controller.js'

const router = new Router()

// Proveedores Routes
router.get('/proveedores', getSuppliers) // Después de la coma va el controlador
router.get('/proveedores/:id', getSupplier)

export default router
