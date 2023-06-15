const expressAsyncHandler = require("express-async-handler");
const payment = require("../models/payment");
const { validationResult } = require("express-validator");
const xendit = require("xendit-node");
const { user } = require("../models/user");
const { default: mongoose } = require("mongoose");
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
  const url = req.url.split("/callback/")[1],
    data = req.body;
  try {
    res.status(200).json({ status: "Success!", messagePath: url, data: data });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//NOTE - Check Payment Request Callback
//REVIEW - This is the  payment method that used
exports.checkPaymentRequest = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1],
    { Customer } = xen,
    c = new Customer({}),
    data = req.body;

  try {
    console.log(data.data.id);
    const isUserExist = await c
      .getCustomer({
        id: data.data.customer_id,
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err));
      });

    if (isUserExist.length === 0) {
      res.status(404);
      throw new Error("User not found!");
    }

    const { reference_id } = isUserExist;

    const paymentUser = await user.updateOne(
      {
        _id: new mongoose.Types.ObjectId(reference_id),
      },
      {
        $push: {
          "essentials.dataBilling": data,
        },
      },
      {
        new: true,
      }
    );

    const paymentData = await payment.create({
      _id: data.data.id,
      event: data.event,
      data: data.data,
    });

    if (paymentUser.modifiedCount !== 1 || paymentUser.matchedCount !== 1) {
      res.status(404);
      throw new Error("User is not found!");
    }

    if (!paymentData) {
      res.status(404);
      throw new Error("Payment Data not created!");
    }

    res.status(200).json({
      status: "Success!",
      messagePath: url,
      message: "Payment Request Callback",
      data: { userData: paymentUser, paymentData: paymentData },
    });
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
//REVIEW - Used Payment method
exports.checkPaymentMethod = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1],
    { Customer } = xen,
    c = new Customer({}),
    data = req.body;

  /**
   * payment_method.activated
   * payment.succeeded
   * payment_method.expired
   */
  try {
    console.log(data.data.id);
    const isUserExist = await c
      .getCustomer({
        id: data.data.customer_id,
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err));
      });

    if (isUserExist.length === 0) {
      res.status(404);
      throw new Error("User not found!");
    }

    const { reference_id } = isUserExist;

    const paymentUser = await user.updateOne(
      {
        _id: new mongoose.Types.ObjectId(reference_id),
      },
      {
        $push: {
          "essentials.dataBilling": data,
        },
      },
      {
        new: true,
      }
    );

    const paymentData = await payment.create({
      _id: data.id,
      event: data.event,
      data: data.data,
    });

    if (paymentUser.modifiedCount !== 1 || paymentUser.matchedCount !== 1) {
      res.status(404);
      throw new Error("User is not found!");
    }

    if (!paymentData) {
      res.status(404);
      throw new Error("Payment Data not created!");
    }

    res.status(200).json({
      status: "Success!",
      messagePath: url,
      message: "Payment Request Callback",
      data: { userData: paymentUser, paymentData: paymentData },
    });
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
