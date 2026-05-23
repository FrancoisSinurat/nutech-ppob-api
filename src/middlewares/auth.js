const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Token tidak tidak valid atau kadaluwarsa', { httpCode: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return errorResponse(res, 'Token tidak tidak valid atau kadaluwarsa', { httpCode: 401 });
  }
}

module.exports = { authenticate };
