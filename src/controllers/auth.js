import User from "../model/user.js";
import { registerSchema } from '../schemas/auth.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

// Hàm đăng ký người dùng
export const signup = async (req, res) => {
    const { username, password, confirmPassword, email, age } = req.body;

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

    // Trả về thông tin người dùng đã đăng ký (không gửi mật khẩu)
    user.password = undefined;
    return res.status(201).json({ user });
};

// Hàm đăng nhập người dùng và trả về token
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Tạo token và trả về
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        return res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm lấy thông tin người dùng
export const getUserInfo = async (req, res) => {
    try {
        // Lấy token từ header Authorization
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập thông tin này' });
        }

        // Xác thực token
        const decoded = jwt.verify(token, 'your-secret-key');  // Sử dụng key đã dùng để tạo token

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Loại bỏ mật khẩu trong thông tin trả về
        user.password = undefined;

        // Trả về thông tin người dùng
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
