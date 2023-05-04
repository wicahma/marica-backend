const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { user } = require("../models/user");

const authJWT = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_CODE);
      if (req.session.user)
        if (req.session.user._id !== decoded.id) {
          res.status(401);
          throw new Error("Not Authorized, wrong user");
        }
      req.session.user = await user
        .findById(decoded.id)
        .select("-essentials.password -__v -createdAt -updatedAt -validated");
    } catch (err) {
      if (!res.status) res.status(401);
      throw new Error(err);
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
  return next();
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_CODE, {
    expiresIn: "2d",
  });
};

const generateValidation = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_CODE, {
    expiresIn: "30m",
  });
};

module.exports = { authJWT, generateToken, generateValidation };
