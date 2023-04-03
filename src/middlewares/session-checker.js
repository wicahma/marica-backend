exports.sessionChecker = (req, res, next) => {
  // console.group("Sessionss!");
  // console.log(`Session ID     : ${req.session.id}`);
  // console.groupEnd();
  console.log("Data user di session: ", req.session.user);
  console.log(req.session);
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized, no Session!");
  }
};
