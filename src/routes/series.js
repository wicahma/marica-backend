const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const {
  getAllSeries,
  createSeries,
  getSeries,
  updateSeries,
} = require("../controllers/series");

router.route("/").get(getAllSeries).post(createSeries).put(updateSeries);
router.get("/one-series", getSeries);

module.exports = router;
