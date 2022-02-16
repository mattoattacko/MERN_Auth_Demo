// overwrites default express error handler

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500 // status code is what we set in the controller. If that is there, use it. Otherwise, use 500.

  res.status(statusCode)

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // if we're in production, don't show the stack trace.
  })
}

module.exports = {
  errorHandler,
}
