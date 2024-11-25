import expressEjsLayouts from 'express-ejs-layouts';
import express from 'express';
import productRouter from './routes/product.js';
import authRouter from './routes/auth.js';
import UIProduct from './routes/uiproducts.js'    
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import session from "express-session";




dotenv.config();

const app = express();

// Sử dụng session
app.use(
  session({
    secret: "secret_key", 
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000', 'https://gk-flutter-app-api.onrender.com'], 
  methods: ['GET', 'POST'],
  credentials: true, 
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
app.use('/ui', UIProduct)

// Cấu hình view engine (ví dụ sử dụng EJS)
app.use(expressEjsLayouts)
app.set("view engine", "ejs");
app.set('views', './src/views');


export const viteNodeApp = app;

// Khởi động server
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
