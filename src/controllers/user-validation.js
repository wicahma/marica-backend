const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const handlebars = require("handlebars");
const { user } = require("../models/user");
const { generateValidation } = require("../middlewares/auth");
const { sendEmail } = require("../configs/email");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

exports.setValidation = asyncHandler(async (req, res) => {
  let validationCode;
  if (req.params.valID) {
    try {
      const reader = fs.readFileSync(__dirname + "/../html/validated.html", {
          encoding: "utf-8",
        }),
        template = handlebars.compile(reader),
        validationCode = req.params.valID,
        decoded = jwt.verify(validationCode, process.env.JWT_CODE),
        isAlreadyValidated = await user.findOne({
          _id: decoded.id,
        });

      if (isAlreadyValidated.validated) {
        res.status(200).send(
          template({
            message:
              "Akun sudah divalidasi sebelumnya, kamu bisa langsung login",
          })
        );
      }

      await user.findByIdAndUpdate(decoded.id, {
        validated: true,
      });
      res.status(200).send(
        template({
          message:
            "Akun berhasil divalidasi, sekarang kamu bisa melakukan banyak kegiatan baruu",
        })
      );
    } catch (err) {
      res.status(400);
      throw new Error(err);
    }
  }
  if (!validationCode) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

exports.renewValidation = asyncHandler(async (req, res) => {
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors,
    };
  }

  try {
    const userExist = await user.findOne({
      email: req.params.email,
    });
    if (!userExist) {
      res.status(400);
      throw new Error("User not found!");
    }
    if (userExist.validated) {
      res.status(400);
      throw new Error("User already validated!");
    }
    const validationCode = generateValidation(userExist._id, userExist.email);
    const mailer = await sendEmail(
      userExist._doc.email,
      userExist._doc.nama,
      `http://localhost:4000/user/${validationCode}/validation`
    );

    if (!mailer) {
      res.status(400);
      throw new Error("Email failed to send!");
    }

    res.status(200).json({
      type: "Renewed!",
      message: "Validation renewed succesfully!",
      data: mailer,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
