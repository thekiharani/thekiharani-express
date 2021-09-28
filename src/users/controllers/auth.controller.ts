import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import pwd from '../../services/password'
import mailer from '../../services/mail'
import config from '../../config/app'

const prisma = new PrismaClient()

// register
const Register = async (req: Request, res: Response) => {
  try {
    const otp = Math.floor(Math.random() * 1000000)
    const { surname, otherNames, email, phoneNumber, password } = req.body
    const hashedPassword = await pwd.makeHash(password)
    const user = await prisma.user.create({
      data: {
        surname: surname,
        otherNames: otherNames,
        email: email,
        phoneNumber: phoneNumber,
        password: hashedPassword,
        otpCode: String(otp),
      },
    })

    await mailer.sendEmail(
      '[Joe Gitonga] Account Verification Code',
      email,
      `Hi ${surname}, use the following code as your account verification code: <br /> <h1>${otp}</h1>`
    )

    return res.status(201).json({
      status: 201,
      message: 'User created',
      user: user,
    })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Login
const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      return res.status(404).json({ status: 404, message: 'not found' })
    }

    const passwordMatched = await pwd.compareHash(password, user.password)

    if (!passwordMatched) {
      return res.status(401).json({
        error: 'invalid creds',
      })
    }

    const payload = {
      id: user.id,
      email: user.email,
    }

    const token = jwt.sign(payload, config.server.token.secret, {
      algorithm: 'HS256',
      expiresIn: Number(config.server.token.expireTime),
    })

    if (!user.isVerified) {
      return res.status(428).json({
        status: 428,
        message: 'verify account',
        token: `Bearer ${token}`,
      })
    }

    return res.status(200).json({
      status: 200,
      message: 'ok',
      token: `Bearer ${token}`,
      user: user,
    })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Verify Account
const Verify = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body
    const user = await prisma.user.findUnique({
      where: {
        id: res.locals.user.id,
      },
    })

    if (user?.isVerified) {
      return res.status(200).json({ status: 200, message: 'already verified' })
    }

    if (user?.otpCode !== otp) {
      return res.status(400).json({ status: 400, message: 'invalid otp code' })
    }

    const activatedUser = await prisma.user.update({
      where: {
        id: res.locals.user.id,
      },
      data: {
        otpCode: null,
        isVerified: true,
      },
    })

    return res.status(200).json({
      status: 200,
      message: 'account verified',
      user: activatedUser,
    })
  } catch (error: any) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'server error',
      error: error,
    })
  }
}

// Profile
const Profile = async (req: Request, res: Response) => {
  const profile = await prisma.user.findUnique({
    where: {
      id: res.locals.user.id,
    },
  })

  return res.status(200).json({
    status: 200,
    message: 'ok',
    profile: profile,
  })
}

export default { Register, Login, Verify, Profile }
