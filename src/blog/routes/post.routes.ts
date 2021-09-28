import express from 'express'
import postctl from '../controllers/post.controller'
import authmd from '../../middleware/auth'

const router = express.Router()

router.get('/', authmd.isAuthenticated, postctl.GetPosts)
router.get('/:id', authmd.isAuthenticated, postctl.GetPostById)
router.post('/', authmd.isAuthenticated, postctl.CreatePost)
router.put('/:id', authmd.isAuthenticated, postctl.UpdatePost)
router.delete('/:id', authmd.isAuthenticated, postctl.DeletePost)

export default router
