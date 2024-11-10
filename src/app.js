import express from 'express';
import productRouter from "./routes/product"
import { connectDB } from './config/db';
import dotenv from "dotenv"
import morgan from 'morgan';

dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

// connect db
connectDB(process.env.DB_URI)

//routes
app.use("/api", productRouter)
export const viteNodeApp = app;