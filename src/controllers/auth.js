import User from "../model/user";
import { registerSchema } from '../schemas/auth';
import bcryptjs from 'bcryptjs'
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
