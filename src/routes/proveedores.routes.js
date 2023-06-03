import { Router } from 'express'
import {
  createSupplier,
  deleteSupplier,
  editSupplier,
  getSupplier,
  getSuppliers
} from '../controllers/proveedores.controller.js'

const router = new Router()

// Proveedores Routes
router.get('/proveedores', getSuppliers) // Después de la coma va el controlador
router.get('/proveedores/:id', getSupplier)
router.post('/proveedores/registrar', createSupplier)
router.put('/proveedores/actualizar/:id', editSupplier)
router.delete('/proveedores/:id', deleteSupplier)

export default router
