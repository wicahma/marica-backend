const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const {
  createSeries,
  getSeries,
  updateSeries,
  deleteSeries,
  getAllSeries,
  updateImageSeries,
} = require("../controllers/series");
const { sessionChecker } = require("../middlewares/session-checker");
const {
  createSeriesValidator,
  updateSeriesValidator,
} = require("./validator/series");
const { thumbnailSeriesHandler } = require("../middlewares/multer");

router
  .route("/")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: false }),
    getSeries
  )
  .post(
    createSeriesValidator,
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    thumbnailSeriesHandler.single("thumbnail"),
    createSeries
  );

router
  .route("/image/:id")
  .put(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    thumbnailSeriesHandler.single("thumbnail"),
    updateImageSeries
  );

router
  .route("/all")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    getAllSeries
  );

router
  .route("/:id")
  .put(
    updateSeriesValidator,
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    updateSeries
  )
  .delete(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    deleteSeries
  );

module.exports = router;
