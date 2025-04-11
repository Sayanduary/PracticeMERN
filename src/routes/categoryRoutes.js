import express from 'express'
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import {
    categoryController,
    createCategoryController,
    singleCategoryController,
    updateCategoryController,
    deleteCategoryController
} from "../controllers/category.controller.js";

const router = express.Router();

// Routes
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
router.get('/get-category', categoryController);
router.get("/single-category/:slug", singleCategoryController);
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

// Export router at the end
export default router;
