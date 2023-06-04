const asyncHandler = require("express-async-handler");

const sessionChecker = asyncHandler(
  async (req, res, next, { admin = false, validated = false }) => {
    if (admin && req.session.user.userType !== "admin") {
      res.status(401);
      return next(Error("Not Authorized, admin only!"));
    }
    if (validated && !req.session.user.validated) {
      res.status(401);
      return next(Error("Not Authorized, user not validated!"));
    }
    if (req.session && req.session.user) {
      console.log("Session Found!");
      return next();
    } else {
      res.status(401);
      return next(Error("Not Authorized, no Session!"));
    }
  }
);

module.exports = { sessionChecker };
