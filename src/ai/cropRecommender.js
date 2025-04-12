export const recommendCrop = (soil) => {
  const { pH, moisture, temperature, nitrogen, phosphorus, potassium } = soil;

  const recommendations = [];

  if (pH >= 6 && pH <= 7 && moisture > 40 && nitrogen > 20)
    recommendations.push("Rice", "Sugarcane");

  if (pH < 6 && nitrogen < 15)
    recommendations.push("Potato", "Peanut");

  if (temperature > 25 && phosphorus > 20)
    recommendations.push("Maize", "Cotton");

  if (pH >= 7 && potassium > 15)
    recommendations.push("Wheat", "Barley");

  if (recommendations.length === 0) recommendations.push("No suitable crop found.");

  return recommendations;
};
