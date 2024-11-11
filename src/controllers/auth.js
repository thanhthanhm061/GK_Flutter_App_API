import User from "../model/user.js";
import { registerSchema } from '../schemas/auth.js';
import bcryptjs from 'bcryptjs'

//Siginup
export const signup = async (req, res) => {
    
        // Lấy dữ liệu từ yêu cầu
        const { username, password, confirmPassword, email, age } = req.body;

        // Kiểm tra dữ liệu có hợp lệ không
        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map((message) => message.message);
            return res.status(400).json({
                messages,
            });
        }

        // Kiểm tra xem user có tồn tại chưa
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email đã được sử dụng." });
        }

        // Kiểm tra mật khẩu xác nhận có khớp không
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu và mật khẩu xác nhận không khớp." });
        }

        // Mã hóa mật khẩu sử dụng bcrypt
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Lưu người dùng vào cơ sở dữ liệu
        const user = await User.create ({
            username,
            email,
            password: hashedPassword,
            age,
        });
      

        // // Trả về thông tin người dùng đã đăng ký (không gửi về mật khẩu)
      user.password = undefined;
      return res.status(201).json({
        user
      })
   
};

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

        // Nếu đăng nhập thành công
        return res.status(200).json({ message: "Đăng nhập thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};