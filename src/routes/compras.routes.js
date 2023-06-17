import { Router } from 'express'
import { createPurchase, createPurchaseType, getPurchase, getPurchaseTypes, getPurchases } from '../controllers/compras.controller.js'

const router = new Router()

// Compras Routes
router.get('/compras/tipo/info', getPurchaseTypes)
router.get('/compras', getPurchases)
router.get('/compras/:id', getPurchase)
router.post('/compras/registrar', createPurchase)
router.post('/compras/tipo/registrar', createPurchaseType)

export default router
