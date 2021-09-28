import express from 'express'
import authctl from '../controllers/auth.controller'
import authmd from '../../middleware/auth'

const router = express.Router()

router.post('/register', authctl.Register)
router.post('/login', authctl.Login)
router.put('/verify', authmd.isAuthenticated, authctl.Verify)
router.get('/profile', authmd.isAuthenticated, authctl.Profile)

export default router
