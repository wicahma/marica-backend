const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const {
  getAllSeries,
  createSeries,
  getSeries,
  updateSeries,
} = require("../controllers/series");

router.get("/", getAllSeries);
router.get("/one-series", getSeries);
router.post("/", createSeries);
router.put("/", updateSeries);

module.exports = router;
