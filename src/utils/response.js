function sendResponse(res, { httpCode = 200, status, data = null, message }) {
  return res.status(httpCode).json({
    status,
    message,
    data,
  });
}

function successResponse(res, message, data = null) {
  return sendResponse(res, {
    httpCode: 200,
    status: 0,
    data,
    message,
  });
}

function errorResponse(res, message, { httpCode = 400, status = 102, data = null } = {}) {
  return sendResponse(res, {
    httpCode,
    status,
    data,
    message,
  });
}

module.exports = { sendResponse, successResponse, errorResponse };
