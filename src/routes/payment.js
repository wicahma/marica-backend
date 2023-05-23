const express = require("express");
const {
  createPayment,
  checkPayment,
  getPayments,
  getBalance,
  paymentRequest,
  checkFVA,
  checkRetails,
  checkDirectDebit,
  checkPaymentRequest,
  checkQRCode,
  checkInvoice,
  checkPaymentMethod,
  checkEWallet,
} = require("../controllers/payment");
const { authJWT } = require("../middlewares/auth");
const { sessionChecker } = require("../middlewares/session-checker");
const router = express.Router();

router
  .route("/balance")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    getBalance
  );

router.route("/").get(
  // authJWT,
  // (req, res, next) =>
  //   sessionChecker(req, res, next, { admin: true, validated: true }),
  paymentRequest
);

// router
//   .route("/")
//   .get(authJWT, sessionChecker, getPayments)
//   .post(authJWT, sessionChecker, createPayment);

// router.route("/check/:id").put(authJWT, sessionChecker, checkPayment);

//NOTE - FVA Callback
router.route("/callback/fva").post(checkFVA);
router.route("/callback/fva-created").post(checkFVA);

//NOTE - Retails Callback
router.route("/callback/retails/success").post(checkRetails);

//NOTE - Cards Callback

//NOTE - Debit Callback
router.route("/callback/direct-debit/account-connected").post(checkDirectDebit);
router.route("/callback/direct-debit/done").post(checkDirectDebit);
router.route("/callback/direct-debit/expired").post(checkDirectDebit);
router.route("/callback/direct-debit/return-cash").post(checkDirectDebit);

//NOTE - Payment Request Callback
router.route("/callback/payment-request/success").post(checkPaymentRequest);
router.route("/callback/payment-request/pending").post(checkPaymentRequest);
router.route("/callback/payment-request/failed").post(checkPaymentRequest);
router
  .route("/callback/payment-request/captured-await")
  .post(checkPaymentRequest);
router
  .route("/callback/payment-request/captured-failed")
  .post(checkPaymentRequest);
router
  .route("/callback/payment-request/captured-success")
  .post(checkPaymentRequest);

//NOTE - QR Code Callback
router.route("/callback/qr-code").post(checkQRCode);

//NOTE - Invoice Callback
router.route("/callback/invoices").post(checkInvoice);

//NOTE - Payment Method Callback
router.route("/callback/payment-method").post(checkPaymentMethod);

//NOTE - Ewallet Callback
router.route("/callback/e-wallet").post(checkEWallet);

//NOTE - Disbursment Callback
router.route("callback/disbursment/sent").post(checkDisbursment);
router.route("callback/disbursment/batch-sent").post(checkDisbursment);
router.route("callback/disbursment/payout-v2").post(checkDisbursment);

module.exports = router;
