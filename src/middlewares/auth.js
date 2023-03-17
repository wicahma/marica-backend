const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const authJWT = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_CODE);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error(error);
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_CODE, {
    expiresIn: "7d",
  });
};

const generateValidation = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_CODE, {
    expiresIn: "30m",
  });
};

module.exports = { authJWT, generateToken, generateValidation };
