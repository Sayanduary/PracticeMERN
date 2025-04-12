import express from 'express';
import { getCropRecommendation } from '../controllers/cropController';

const router = express.Router();

router.post('/recommend', getCropRecommendation)

export default router;