const { body, param } = require("express-validator");

exports.createSeriesValidator = [
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
];

exports.updateSeriesValidator = [
  param("id")
    .exists()
    .withMessage("ID is required!")
    .isMongoId()
    .withMessage("ID must be a MongoID!"),
  body("judul")
    .isLength({ min: 1, max: 100 })
    .withMessage("Judul must be between 1 and 100 characters long!"),
  body("deskripsi")
    .isLength({ min: 1, max: 250 })
    .withMessage("Deskripsi must be between 1 and 250 characters long!"),
  body("status").isBoolean().withMessage("Status must be a boolean!"),
  body("videos").isArray().withMessage("Videos must be an array!"),
];
