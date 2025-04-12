import { recommendCrop } from '../ai/cropRecommender.js';
import CropLog from '../models/CropLog.js';

export const getCropRecommendation = async (req, res) => {
  try {
    const soil = req.body;
    const recommendedCrops = recommendCrop(soil);

    await CropLog.create({ input: soil, recommendedCrops });

    res.json({ crops: recommendedCrops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
