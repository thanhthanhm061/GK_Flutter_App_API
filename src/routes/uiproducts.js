import express from "express";

const router = express.Router();

router.get(`/products`, async (req,res) => { 

    try {
        const response = await fetch(`http://localhost:3000/api/products`);
        const data = await response.json();
        // Hiển thị danh sách bài hát
        res.render('product', { products: data.products })
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát:", error);
        res.render('product', {products: []})
    }  
 
})
export default router;