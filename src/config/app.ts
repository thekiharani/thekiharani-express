import dotenv from 'dotenv'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
dotenv.config()

const SERVER_HOST = process.env.SERVER_HOST || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 8004
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 43200
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'thekiharani'
const SERVER_TOKEN_SECRET =
  process.env.SERVER_TOKEN_SECRET || 'gLhHRBBBEyj62BO+WRaPG5Pa3nBuvXqIpz5OaA'

const SERVER = {
  hostname: SERVER_HOST,
  port: SERVER_PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
}

const MAIL: SMTPTransport.Options = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USERNAME || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
}

const DEV_MAIL: SMTPTransport.Options = {
  port: 1025,
}

const config = {
  server: SERVER,
  mail: MAIL,
  devMail: DEV_MAIL,
}

export default config
