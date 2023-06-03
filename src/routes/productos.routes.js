import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts
} from '../controllers/productos.controller.js'

const router = new Router()

// Productos Routes
router.get('/productos', getProducts)
router.get('/productos/:id', getProduct)
router.post('/productos/registrar', createProduct)
router.put('/productos/actualizar/:id', editProduct)
router.delete('/productos/:id', deleteProduct)

export default router
