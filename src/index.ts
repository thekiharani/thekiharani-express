import express, { Request, Response } from 'express'
import cors from 'cors'
import config from './config/app'
import authRoutes from './users/routes/auth.routes'

const app = express()
app.use(cors())
app.use(express.json())

const SERVER_HOST = config.server.hostname
const SERVER_PORT = config.server.port

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: 'ok' })
})

app.use('/auth', authRoutes)

app.listen(SERVER_PORT, () => {
  console.log(`Dev server running at: http://${SERVER_HOST}:${SERVER_PORT}`)
})
