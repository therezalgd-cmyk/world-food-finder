const express = require("express");
const router = express.Router();

router.use("/foods", require("./foods"));
router.use("/bkash", require("./bkash"));
router.use("/revenue", require("./revenue"));
router.use("/affiliate", require("./affiliate"));
router.use("/subscription", require("./subscription"));
router.use("/promotion", require("./promotion"));
router.use("/analytics", require("./analytics"));
router.use("/maps", require("./maps"));
router.use("/social", require("./social"));
router.use("/dbbl", require("./dbbl"));

router.get("/", (req, res) => {
  res.json({
    api: "world-food-finder",
    version: "1.0",
  });
});

module.exports = router;