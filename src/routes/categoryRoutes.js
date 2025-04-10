import express from 'express'
import {isAdmin , requireSignIn} from './../middlewares/authMiddleware';
import {categoryController,createCategoryController,singleCategoryController,updateCategoryController,
    deleteCategoryController
} from "./../controllers/categoryController.js";
const router= express.Router();



router.post('/create -category',isAdmin , requireSignIn,createCategoryController);

router.put('/update-category/:id', requireSignIn,isAdmin,updateCategoryController);


router.get('/get-category',categoryController);


router.get("/single-category/:slug",singleCategoryController);
export default router;

router.delete('/delete-category/:id', requireSignIn,isAdmin,deleteCategoryController);
