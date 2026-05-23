function sendResponse(res, { httpCode = 200, success, code, data = null, message }) {
  return res.status(httpCode).json({
    success,
    code,
    data,
    message,
  });
}

function successResponse(res, message, data = null, code = 200) {
  return sendResponse(res, {
    httpCode: 200,
    success: true,
    code,
    data,
    message,
  });
}

function errorResponse(res, message, { httpCode = 400, code = httpCode, data = null } = {}) {
  return sendResponse(res, {
    httpCode,
    success: false,
    code,
    data,
    message,
  });
}

module.exports = { sendResponse, successResponse, errorResponse };
