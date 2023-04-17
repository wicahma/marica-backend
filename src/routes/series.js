const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const {
  createSeries,
  getSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/series");
const { sessionChecker } = require("../middlewares/session-checker");
const {
  createSeriesValidator,
  updateSeriesValidator,
} = require("./validator/series");

router
  .route("/")
  .get(authJWT, sessionChecker, getSeries)
  .post(createSeriesValidator, authJWT, sessionChecker, createSeries);

router
  .route("/:id")
  .put(updateSeriesValidator, authJWT, sessionChecker, updateSeries)
  .delete(authJWT, sessionChecker, deleteSeries);

module.exports = router;
