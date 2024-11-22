import User from "../model/user.js";
import bcryptjs from 'bcryptjs';

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

// Tạo mới người dùng
export const createUser = async (req, res) => {
    try {
        const { username, email, password, age } = req.body;

   
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, age });
        return res.status(201).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, age } = req.body; 

    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
        }

        // Cập nhật thông tin người dùng
        user.username = username || user.username;
        user.email = email || user.email;
        user.age = age || user.age;

        const updatedUser = await user.save(); 

        return res.status(200).json({ success: true, message: "Cập nhật thành công", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL params

    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
        }

        // Xóa người dùng
        await user.remove();

        return res.status(200).json({ success: true, message: "Người dùng đã bị xóa." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy thông tin người dùng
export const getUserInfo = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để truy cập thông tin này." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng.", error: error.message });
    }
};
