exports.sessionChecker = (req, res, next) => {
  console.group("Sessionss!");
  console.log(`Session ID     : ${req.session.id}`);
  console.log(req.session);
  console.groupEnd();
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized, no Session!");
  }
};
