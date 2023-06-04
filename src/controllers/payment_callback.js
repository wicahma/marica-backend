const expressAsyncHandler = require("express-async-handler");
const payment = require("../models/payment");
const { validationResult } = require("express-validator");
const xendit = require("xendit-node");
const xen = new xendit({
  secretKey: process.env.XENDIT_API_KEY.toString(),
});

//SECTION - Xendit Callback strategy

//NOTE - Check FVA Callback
exports.checkFVA = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;

  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Retails Callback
exports.checkRetails = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Debit Callback

exports.checkDirectDebit = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Payment Request Callback
exports.checkPaymentRequest = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check QR Code Callback
exports.checkQRCode = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Invoice Callback
exports.checkInvoice = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Payment Method Callback
exports.checkPaymentMethod = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1],
    data = req.body,
    {
      id,
      data: {
        type,
        status,
        created,
        reference_id,
        reusability,
        virtual_account,
        ewallet,
        card,
        qr_code,
      },
    } = data;
  try {
    res
      .status(200)
      .json({ status: "Success!", messagePath: url, data: { xendit: data } });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Ewallet Callback
exports.checkEWallet = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Disbursment Callback
exports.checkDisbursment = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
