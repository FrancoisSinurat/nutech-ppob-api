// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const httpCode = err.statusCode || 500;
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(httpCode).json({ status, message, data: null });
}

module.exports = errorHandler;
