const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  console.group("Error Handler - Existing error:");
  console.error({
    name: err.name,
    message: err.message,
    session: req.session.cookie,
    user: req.session.user,
    stack: err.stack,
  });
  console.groupEnd();

  if (res.headersSent) {
    return next(err);
  }
  res.status(statusCode);
  res.json({
    type: err.name ? err.name : "Middleware Error!",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
