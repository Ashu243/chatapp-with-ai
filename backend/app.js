
import express from "express"
import connectDb from "./src/db/db.js";
import morgan from "morgan";
import userRoutes from "./src/routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import projectRoutes from './src/routes/projectRoutes.js'
import teamRoutes from './src/routes/teamRoutes.js'
import aiRoutes from './src/routes/ai.routes.js'
import messagesRoutes from './src/routes/message.routes.js'



const app = express()
connectDb()


app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));



app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/messages/', messagesRoutes)


export default app