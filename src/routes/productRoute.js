import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController } from '../controllers/product.controller.js';
import formidable from "express-formidable"

const router = express.Router();


router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

router.get('/get-product', getProductController)

router.get('/get-product/:slug', getSingleProductController)


router.get('/product-photo/:pid', productPhotoController)

router.delete('/delete-product', requireSignIn, isAdmin, deleteProductController)


router.put('/update-product', requireSignIn, isAdmin, updateProductController)

export default router;