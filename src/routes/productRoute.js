import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController,productFilterController,productCountController,productListController, searchProductController, relatedProductController, productCategoryController } from '../controllers/product.controller.js';
import formidable from "express-formidable"

const router = express.Router();


router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

router.get('/get-product', getProductController)

router.get('/get-product/:slug', getSingleProductController)


router.get('/product-photo/:pid', productPhotoController)
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController);


router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

router.post('/product-filter',productFilterController)

router.get('/product-count',productCountController)


router.get('/product-list/:page',productListController)



router.get('/search/:keyword', searchProductController)

router.get('/related-product/:pid/:cid', relatedProductController)

router.get('/product-category/:slug', productCategoryController);



export default router;