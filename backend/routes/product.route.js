import express from "express"
<<<<<<< HEAD
import { createProduct, getAllProducts,getFeaturedProducts, deleteProduct } from "../controllers/product.controller.js"
=======
import { getAllProducts } from "../controllers/product.controller.js"
>>>>>>> cdb6ba8c480f7075f94c8cd7680545f81503b6d5
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/",protectRoute,adminRoute,getAllProducts)
<<<<<<< HEAD
router.get("/featured", getFeaturedProducts)
router.post("/",protectRoute,adminRoute,createProduct)
router.delete("/:id",protectRoute,adminRoute,deleteProduct)
=======

>>>>>>> cdb6ba8c480f7075f94c8cd7680545f81503b6d5
export default router