const express = require("express");
const {
  setValidation,
  renewValidation,
} = require("../controllers/user-validation");
const router = express.Router();
const { body, param } = require("express-validator");

router.route("/:valID/validation").get(setValidation);
router
  .route("/:email/validation/create")
  .get(
    [param("email").exists().isEmail().isLength({ min: 1, max: 50 })],
    renewValidation
  );

module.exports = router;
