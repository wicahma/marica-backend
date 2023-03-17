const express = require("express");
const {
  setValidation,
  renewValidation,
} = require("../controllers/user-validation");
const router = express.Router();

router.get("/:valID/validation", setValidation);
router.get("/:email/validation/create", renewValidation);

module.exports = router;
