import User from "../model/user.js";
import { registerSchema } from '../schemas/auth.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

// Lấy danh sách người dùng với phân trang và tìm kiếm
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query; 

        const query = search ? { username: { $regex: search, $options: 'i' } } : {}; 

        // Lấy danh sách người dùng với phân trang và tìm kiếm
        const users = await User.find(query)
            .select("-password") 
            .skip((page - 1) * limit) 
            .limit(Number(limit));

        // Lấy tổng số người dùng để tính số trang
        const totalUsers = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Hàm đăng ký người dùng
export const signup = async (req, res) => {
    const { username, password, confirmPassword, email, age } = req.body;

    try {
        // Kiểm tra dữ liệu có hợp lệ không
        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map((message) => message.message);
            return res.status(400).json({ messages });
        }

        // Kiểm tra xem email đã tồn tại chưa
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email đã được sử dụng." });
        }

        // Kiểm tra mật khẩu xác nhận có khớp không
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu và mật khẩu xác nhận không khớp." });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Lưu người dùng vào cơ sở dữ liệu
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            age,
        });

        // Tạo token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.password = undefined;

        return res.status(201).json({
            message: "Đăng ký thành công",
            user,
            token,
            redirectUrl: "/api/signin", 
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server: " + error.message });
    }
};


// Hàm đăng nhập người dùng và trả về token
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Tạo token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            redirectUrl: "/ui/products",
        });
    } catch (error) {
        console.error("Error in signin:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const getUserInfo = async (req, res) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để truy cập thông tin này." });
        }
        const token = authHeader.split(" ")[1];

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        // Trả về thông tin người dùng
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng.", error: error.message });
    }
};