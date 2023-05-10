const express = require("express");
const {
  createPayment,
  checkPayment,
  getPayments,
  getBalance,
  paymentRequest,
} = require("../controllers/payment");
const { authJWT } = require("../middlewares/auth");
const { sessionChecker } = require("../middlewares/session-checker");
const router = express.Router();

router
  .route("/balance")
  .get(
    authJWT,
    (req, res, next) => sessionChecker(req, res, next, "protected"),
    getBalance
  );

router
  .route("/")
  .get(
    authJWT,
    (req, res, next) => sessionChecker(req, res, next, "protected"),
    paymentRequest
  );

// router
//   .route("/")
//   .get(authJWT, sessionChecker, getPayments)
//   .post(authJWT, sessionChecker, createPayment);

// router.route("/check/:id").put(authJWT, sessionChecker, checkPayment);

module.exports = router;
