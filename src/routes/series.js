const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const {
  createSeries,
  getSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/series");
const { body } = require("express-validator");

router
  .route("/")
  .get(getSeries)
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
  );
router.route("/:id").put(updateSeries).delete(deleteSeries);

module.exports = router;
