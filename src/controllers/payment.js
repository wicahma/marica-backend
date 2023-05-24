const expressAsyncHandler = require("express-async-handler");
const payment = require("../models/payment");
const { validationResult } = require("express-validator");
const xendit = require("xendit-node");
const xen = new xendit({
  secretKey: process.env.XENDIT_API_KEY.toString(),
});

// * Main Payment Controller

exports.getBalance = expressAsyncHandler(async (req, res) => {
  try {
    const { Balance } = xen;
    const balanceSpecificOptions = {
      Headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.XENDIT_API_KEY.toString()
        ).toString("base64")}`,
      },
    };
    const b = new Balance(balanceSpecificOptions);

    const resp = await b.getBalance({
      accountType: "CASH",
      currency: "IDR",
    });
    res.status(200).json(resp);
  } catch (err) {
    if (!res.status) res.status(500);
    console.log(err);
    throw new Error(err);
  }
});

//NOTE - documentation link: https://developers.xendit.co/api-reference/?javascript#payment-object
exports.paymentRequest = expressAsyncHandler(async (req, res) => {
  const { PaymentRequest } = xen;
  const { paymentType, paymentChannel } = req.body;
  //NOTE - payment_method_type
  /*
  - EWALLET
      > DANA
      > ASTRAPAY
      > OVO (On Activation Request)
      > LINKAJA (On Activation Request)
      > SHOPEEPAY (On Activation Request)
  - VIRTUAL_ACCOUNT 
      > BSI
      > BJB
      > SAHABAT_SAMPOERNA
      > PERMATA
      > BRI
      > BNI
      > MANDIRI
      > BCA (Need Website)
  - OVER_THE_COUNTER
      > ALFAMART (Need Website)
  - QR_CODE (QRIS)
  */
  const main_type = "EWALLET",
    name = "Teguh Dwi Cahya Kusuma",
    mobile_number = "085751080434",
    amount = 10000,
    success_return_url = "https://marica.id/success",
    failure_return_url = "https://marica.id/failure",
    expires_at = Date.now() + 86400000,
    va_channel_code = "BNI",
    qr_channel_code = "DANA",
    currency = "IDR",
    country="ID",
    ewallet_channel_code = "SHOPEEPAY",
    r = new PaymentRequest({});
  try {
    await r
      .createPaymentRequest({
        amount: amount,
        currency: currency,
        reusability: "ONE_TIME_USE",
        type: main_type,
        description: "Payment untuk fitur berlangganan pengguna",
        country: country,
        ewallet: {
          channel_code: ewallet_channel_code,
          amount: amount,
          channel_properties: {
            mobile_number: mobile_number,
            success_return_url: success_return_url,
            failure_return_url: failure_return_url,
          },
        },
        // over_the_counter: {
        //   channel_code: "ALFAMART",
        //   currency: currency,
        //   channel_properties: {
        //     customer_name: name,
        //     expires_at: expires_at,
        //   },
        // },
        // virtual_account: {
        //   channel_code: va_channel_code,
        //   channel_properties: {
        //     customer_name: name,
        //     expires_at: expires_at,
        //   },
        // },
        qr_code: {
          channel_code: qr_channel_code,
          currency: currency,
        },
      })
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err.message));
      });
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

//REVIEW - Mayar Old Method

// ANCHOR Get One Payment
/*
@Route /payment?id=paymentId
* Method : GET
* Access : Admin & Orangtua
* Query  : id (PaymentID)
*/

// exports.getPayments = expressAsyncHandler(async (req, res) => {
//   const { userType, _id } = req.session.user;
//   const { id } = req.query;
//   let findPaymentId = {
//     _id: id,
//   };

//   if (userType === "admin") {
//     !id && (findPaymentId = {});
//   } else {
//     if (!id) {
//       findPaymentId = {
//         idUser: _id,
//       };
//     }
//   }

//   try {
//     const payments = await payment.find(findPaymentId);
//     if (id && payments.length === 0) {
//       res.status(400);
//       throw new Error("Payment not found!");
//     }
//     res.status(200).json(payments);
//   } catch (err) {
//     if (!res.status) res.status(500);
//     throw new Error(err);
//   }
// });

// ANCHOR Create Payment
/*  
@Route /payment
* Method : GET
* Access : Admin 
*/

// exports.createPayment = expressAsyncHandler(async (req, res) => {
//   const {
//     email,
//     essentials: { phone },
//     nama,
//   } = req.session.user;

//   if (!phone) {
//     res.status(400);
//     throw {
//       type: "Validation Error",
//       message: "You must add a phone number to your account first!",
//       stack: new Error().stack,
//     };
//   }

//   try {
//     const invoiceCreate = await fetch(
//       `${process.env.PAYMENT_URL}hl/v1/payment/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
//         },
//         body: JSON.stringify({
//           name: nama,
//           email: email,
//           amount: 29_999,
//           mobile: phone,
//           redirectUrl: "https://marica.vercel.app/",
//           description: "Langganan TV Marica 1 bulan",
//         }),
//       }
//     );
//     const { data } = await invoiceCreate.json();
//     const paymentData = {
//       _id: data.id,
//       transactionId: data.transaction_id,
//       link: data.link,
//       idUser: req.session.user._id,
//       expiredAt: new Date().setDate(new Date().getDate() + 1),
//     };

//     const newPayment = payment.create(paymentData);

//     if (!newPayment) {
//       res.status(500);
//       throw new Error("Failed to create payment!");
//     }

//     res.status(200).json({ ...paymentData });
//   } catch (err) {
//     if (!res.status) res.status(500);
//     throw new Error(err);
//   }
// });

// exports.checkPayment = expressAsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const now = new Date();
//   try {
//     const invoiceCheck = await fetch(
//       `${process.env.PAYMENT_URL}hl/v1/payment/${id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
//         },
//       }
//     );
//     const { data, statusCode } = await invoiceCheck.json();

//     const { _doc: updatedPayment } = await payment.findOne({ _id: id });

//     // @NOTE - Payment checker
//     if (!updatedPayment) {
//       res.status(400);
//       throw new Error("Payment not found!");
//     } else if (
//       now > new Date(updatedPayment.expiredAt) ||
//       updatedPayment.status === "closed"
//     ) {
//       updatedPayment.status = "closed";
//       updatedPayment.link = false;
//       await payment.updateOne({ _id: id }, updatedPayment).exec();
//       res.status(400);
//       throw new Error("Payment expired!");
//     } else if (updatedPayment.status === "paid") {
//       res.status(400);
//       throw new Error("Payment already paid!");
//     }

//     // @NOTE - Payment Gateway checker
//     if (statusCode !== 200) {
//       res.status(400);
//       throw new Error("Payment not found!");
//     } else if (data.status !== "paid") {
//       res.status(400);
//       throw new Error("Payment still unpaid, please paid first!");
//     }

//     // @NOTE - Update Payment & set expiration date
//     updatedPayment.status = "paid";
//     updatedPayment.expiredAt = now.setMonth(now.getMonth() + 1);
//     await payment.updateOne({ _id: id }, updatedPayment).exec();
//     res.status(200).json(updatedPayment);
//   } catch (err) {
//     if (!res.status) res.status(500);
//     throw new Error(err);
//   }
// });

//SECTION - Xendit Callback strategy

//NOTE - Check FVA Callback
exports.checkFVA = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});

//NOTE - Check Retails Callback
exports.checkRetails = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});

//NOTE - Check Debit Callback

exports.checkDirectDebit = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});

//NOTE - Check Payment Request Callback
exports.checkPaymentRequest = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});

//NOTE - Check QR Code Callback
exports.checkQRCode = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});

//NOTE - Check Invoice Callback
exports.checkInvoice = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
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

  res
    .status(200)
    .json({ status: "Success!", messagePath: url, data: { xendit: data } });
});

//NOTE - Check Ewallet Callback
exports.checkEWallet = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});

//NOTE - Disbursment Callback
exports.checkDisbursment = expressAsyncHandler(async (req, res) => {
  const url = req.url.split("/callback/")[1];
  const data = req.body;
  res.status(200).json({ status: "Success!", messagePath: url, data: data });
});
