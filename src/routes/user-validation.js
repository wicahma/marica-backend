const express = require("express");
const {
  setValidation,
  renewValidation,
} = require("../controllers/user-validation");
const router = express.Router();
const { param } = require("express-validator");

router.route("/:valID/validation").get(setValidation);
router
  .route("/:email/validation/create")
  .get(
    [param("email").exists().isEmail().isLength({ min: 1 })],
    renewValidation
  );

module.exports = router;
