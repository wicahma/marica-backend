const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { user } = require("../models/user");
const { generateValidation } = require("../middlewares/auth");
const { sendEmail } = require("../configs/email");

exports.setValidation = asyncHandler(async (req, res) => {
  let validationCode;
  if (req.params.valID) {
    try {
      validationCode = req.params.valID;
      const decoded = jwt.verify(validationCode, process.env.JWT_CODE);
      const userData = await user.findByIdAndUpdate(decoded.id, {
        validated: true,
      });
      res.status(200).json({ message: "User validated!" });
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
  if (!req.params.email) {
    res.status(401);
    throw new Error("No parameter included!, hint: ID");
  }
  try {
    const userExist = await user.findOne({
      email: req.params.email,
    });
    if (!userExist) {
      res.status(401);
      throw new Error("User not found!");
    }
    const validationCode = generateValidation(userExist._id, userExist.email);
    const emails = sendEmail(
      userExist._doc.email,
      `http://localhost:4000/user/${validationCode}/validation`
    );
    res.status(200).json({ message: emails });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});
