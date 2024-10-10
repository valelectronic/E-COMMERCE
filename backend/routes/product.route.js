import express from "express"

import {toggleFeaturedProducts, getProductsByCategory, getRecommendedProducts, createProduct, getAllProducts,getFeaturedProducts, deleteProduct } from "../controllers/product.controller.js"


import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/",protectRoute,adminRoute,getAllProducts)
router.get("/featured", getFeaturedProducts)
router.get("/featured", getFeaturedProducts)
router.get("/category/:category", getProductsByCategory)
router.get("/recommendation", getRecommendedProducts)
router.patch("/:id",protectRoute,adminRoute, toggleFeaturedProducts)
router.post("/",protectRoute,adminRoute,createProduct)
router.delete("/:id",protectRoute,adminRoute,deleteProduct)

export default router