import express from 'express';
import productRouter from './routes/product.js';
import authRouter from './routes/auth.js';       
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));

// connect db
connectDB(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => console.log("Kết nối thành công tới MongoDB"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// routes
app.use('/api', productRouter);
app.use('/api', authRouter);


export const viteNodeApp = app;

// Khởi động server
const port = process.env.port || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

