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
      console.log("Decoded ", decoded);
      req.session.user = await user.findById(decoded.id).select("-password");
      console.log("User Data ", req.session.user);
    } catch (err) {
      res.status(401);
      throw new Error(err);
    }
    return next();
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
