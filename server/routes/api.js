// C:\Users\KHON\Desktop\world-food-finder-live\world-food-finder\server\routes\api.js

const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

// Test route
router.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

// Get all foods
router.get("/foods", foodController.getAllFoods);

// Get food by ID
router.get("/foods/:id", foodController.getFoodById);

// Create new food
router.post("/foods", foodController.createFood);

// Update food by ID
router.put("/foods/:id", foodController.updateFood);

// Delete food by ID
router.delete("/foods/:id", foodController.deleteFood);

module.exports = router;
