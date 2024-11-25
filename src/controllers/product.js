import Product from "../model/product.js";

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const data = await Product.find().skip(skip).limit(limit);
        const total = await Product.countDocuments();
        
        if (data.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            products: data
        }); 
    } catch (error) {
        console.error("Error retrieving products:", error); 
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Lấy sản phẩm theo ID
export const getProductsById = async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params.id });
        if (!data) {
            return res.status(404).json({ message: "No product found" });
        }
        res.status(200).json(data); 
    } catch (error) {
        console.error("Error retrieving product by ID:", error); 
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Thêm sản phẩm mới
export const addProducts = async (req, res) => {
    const { title, artist, audioUrl, lyrics } = req.body;

    // Kiểm tra nếu thiếu trường nào
    if (!title || !artist || !audioUrl || !lyrics) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newProduct = new Product(req.body); 
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); 
    } catch (error) {
        console.error("Error adding product:", error);  
        res.status(500).json({ message: "Server error: " + error.message });
    }
};


// Xóa sản phẩm theo ID
export const deleteProducts = async (req, res) => {

    try {
        const data = await Product.findOneAndDelete({ _id: req.params.id });
        if (!data) {
            return res.status(404).json({ message: "No product found to delete" });
        }
        res.status(200).json({ message: "Product deleted successfully", data });
    } catch (error) {
        console.error("Error deleting product:", error);  
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Cập nhật sản phẩm theo ID
export const updateProducts = async (req, res) => {
    try {
        const data = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!data) {
            return res.status(404).json({ message: "No product found to update" });
        }
        res.status(200).json({ message: "Product updated successfully", data });
    } catch (error) {
        console.error("Error updating product:", error);  
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
