import express from "express";
import {
    addProducts,
    deleteProducts,
    getProducts,
    getProductsById,
    updateProducts,
} from "../controllers/product";

const router = express.Router();

router.get(`/products`, getProducts);
router.get(`/products/:id`, getProductsById);
router.post(`/products`, addProducts);
router.put(`/products/:id`, updateProducts); 
router.delete(`/products/:id`, deleteProducts);

export default router;
