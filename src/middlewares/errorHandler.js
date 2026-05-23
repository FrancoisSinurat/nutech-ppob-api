const { errorResponse } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const httpCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, { httpCode });
}

module.exports = errorHandler;
