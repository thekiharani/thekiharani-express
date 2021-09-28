import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get Posts
const GetPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({})
    return res.status(200).json({ status: 200, message: 'ok', posts: posts })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Get Post by ID
const GetPostById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const post = await prisma.post.findUnique({ where: { id: id } })

    if (!post) {
      return res.status(404).json({ status: 404, message: 'not found' })
    }

    return res.status(200).json({ status: 200, message: 'ok', post: post })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Create Posts
const CreatePost = async (req: Request, res: Response) => {
  try {
    const { title, body, summary, published } = req.body
    const post = await prisma.post.create({
      data: {
        title: title,
        body: body,
        summary: summary ?? null,
        authorId: res.locals.user.id,
        isPublished: Boolean(published),
        publishedAt: Boolean(published) ? new Date() : null,
      },
    })
    return res.status(201).json({ status: 201, message: 'created', post: post })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Update Posts
const UpdatePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const { title, body, summary, published } = req.body
    const post = await prisma.post.findUnique({ where: { id: id } })

    if (!post) {
      return res.status(404).json({ status: 404, message: 'not found' })
    }

    const updated = await prisma.post.update({
      where: { id: id },
      data: {
        title: title,
        body: body,
        summary: summary,
        isPublished: Boolean(published),
        publishedAt: Boolean(published) ? new Date() : null,
      },
    })

    return res
      .status(200)
      .json({ status: 200, message: 'updated', post: updated })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Delete Posts
const DeletePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const { title, body, published } = req.body
    const post = await prisma.post.findUnique({ where: { id: id } })

    if (!post) {
      return res.status(404).json({ status: 404, message: 'not found' })
    }

    const trashed = await prisma.post.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    })

    return res
      .status(200)
      .json({ status: 200, message: 'trashed', post: trashed })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

export default { GetPosts, GetPostById, CreatePost, UpdatePost, DeletePost }
