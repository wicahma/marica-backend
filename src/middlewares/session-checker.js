const asyncHandler = require("express-async-handler");

const sessionChecker = asyncHandler(
  async (req, res, next, { admin = false, validated = false }) => {
    if (admin && req.session.user.userType !== "admin") {
      res.status(401);
      throw new Error("Not Authorized, admin only!");
    }
    if (validated && !req.session.user.validated) {
      res.status(401);
      throw new Error("Not Authorized, user not validated!");
    }
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401);
      throw new Error("Not Authorized, no Session!");
    }
  }
);

module.exports = { sessionChecker };
