const express = require("express");
const foodController = require("../controllers/foodController");

const router = express.Router();

router.get("/foods", foodController.list);

module.exports = router;