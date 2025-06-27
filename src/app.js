import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import eventRoutes from './routes/event.routes.js'



const app = express()
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
export default app;