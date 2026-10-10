const express = require("express");
const foodController = require("../controllers/foodController");

const router = express.Router();

router.get("/", foodController.list);

module.exports = router;