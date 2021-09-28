import express, { Request, Response } from 'express'
import cors from 'cors'
import { logMe } from './controllers'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 8000
const HOST = 'localhost'

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: 'ok' })
})

app.listen(PORT, () => {
  logMe()
  console.log(`Dev server running at: http://${HOST}:${PORT}`)
})
