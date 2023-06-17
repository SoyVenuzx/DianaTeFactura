import { Router } from 'express'

const router = new Router()

// Facturas Routes
router.get('/facturas')
router.post('/facturas/registrar')

export default router
