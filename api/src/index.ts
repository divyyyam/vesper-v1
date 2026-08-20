import { Hono } from 'hono'
import authRoutes from './routes/auth.route'
import { cors } from 'hono/cors'
import appointmentRoutes from './routes/appointment.route'


export type Env = {
  DATABASE_URL:string
}

const app = new Hono<{Bindings:Env}>()


app.use('*',cors())
app.get('/', (c) => {
  c.env.DATABASE_URL
  return c.text('API working!')
})


app.route('/api/v1/auth',authRoutes)
app.route('/api/v1/appointment',appointmentRoutes)

export default app
