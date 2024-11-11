import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        // Cấu hình kết nối MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,  
        });

        console.log("Kết nối MongoDB thành công");
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error.message);
        console.error("Stack trace:", error.stack);
    }
};
