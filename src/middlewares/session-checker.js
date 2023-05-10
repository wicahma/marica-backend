exports.sessionChecker = (req, res, next, status) => {
  if (status === "protected") {
    if (req.session.user.userType !== "admin") {
      res.status(401);
      throw new Error("Not Authorized, admin only!");
    }
  }
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized, no Session!");
  }
};
