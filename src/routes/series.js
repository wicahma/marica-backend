const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const {
  getAllSeries,
  createSeries,
  getSeries,
  updateSeries,
} = require("../controllers/series");
const { body } = require("express-validator");

router
  .route("/")
  .get(getAllSeries)
  .post(
    [
      body("judul")
        .exists()
        .withMessage("Judul is required!")
        .isLength({ min: 1, max: 100 })
        .withMessage("Judul must be between 1 and 100 characters long!"),
      body("deskripsi")
        .exists()
        .withMessage("Deskripsi is required!")
        .isLength({ min: 1, max: 250 })
        .withMessage("Deskripsi must be between 1 and 250 characters long!"),
    ],
    createSeries
  )
  .put(updateSeries);
router.get("/one-series", getSeries);

module.exports = router;
