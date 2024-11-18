import express from 'express';
import productRouter from './routes/product.js';
import authRouter from './routes/auth.js';       
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';       

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000', 'https://gk-flutter-app-api.onrender.com'], // Chỉ cho phép các domain này
  methods: ['GET', 'POST'], // Chỉ cho phép các phương thức HTTP cụ thể
  credentials: true, // Cho phép gửi cookie hoặc header xác thực
}));
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

// Định nghĩa route
app.use("/api/users", userRoutes);

export const viteNodeApp = app;

// Khởi động server
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

