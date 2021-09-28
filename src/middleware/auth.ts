import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import config from '../config/app'

const prisma = new PrismaClient()

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization?.split(' ')[1]

  if (token) {
    jwt.verify(
      token,
      config.server.token.secret,
      async (error, decoded: any) => {
        if (error) {
          return res.status(401).json({
            status: 401,
            message: error.message,
            error: error,
          })
        } else {
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
          })

          if (!user) {
            return res.status(401).json({
              status: 401,
              message: 'unauthorized',
            })
          }
          res.locals.user = decoded
          next()
        }
      }
    )
  } else {
    return res.status(401).json({
      status: 401,
      message: 'unauthorized',
    })
  }
}

const isGuest = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(' ')[1]

  if (token) {
    jwt.verify(
      token,
      config.server.token.secret,
      async (error, decoded: any) => {
        if (error) {
          next()
        } else {
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
          })

          if (!user) {
            res.locals.user = decoded
            return res.status(200).json({
              status: 200,
              message: 'already authorized',
            })
          }
        }
      }
    )
  } else {
    next()
  }
}

export default { isAuthenticated, isGuest }
