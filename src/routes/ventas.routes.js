import { Router } from 'express'
import { createSale, createTypeSale, deletSale, editSale, getSale, getSales, getTypesSales } from '../controllers/ventas.controller.js'

const router = new Router()

// Ventas Routes
router.get('/ventas', getSales)
router.get('/ventas/:id', getSale)
router.delete('/ventas/:id', deletSale)
router.post('/ventas/registrar', createSale)
router.put('/ventas/actualizar/:id', editSale)
router.get('/ventas/tipo/info', getTypesSales)
router.post('/ventas/tipo/registrar', createTypeSale)

export default router
