import User from "../model/user.js";

// Lấy danh sách người dùng
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Loại bỏ mật khẩu khi trả về
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Tạo mới người dùng
export const createUser = async (req, res) => {
    try {
        const { username, email, password, age } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
        }

        // Tạo người dùng mới
        const user = await User.create({ username, email, password, age });
        return res.status(201).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
