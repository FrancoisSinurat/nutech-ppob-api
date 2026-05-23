const express = require('express');
const path = require('path');

const membershipRoutes = require('./routes/membership');
const informationRoutes = require('./routes/information');
const transactionRoutes = require('./routes/transaction');
const errorHandler = require('./middlewares/errorHandler');
const { successResponse, errorResponse } = require('./utils/response');

const app = express();

app.get('/', (_req, res) => {
  return successResponse(res, 'API is running');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded profile images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/', membershipRoutes);
app.use('/', informationRoutes);
app.use('/', transactionRoutes);

// multer error passthrough (file format validation)
app.use((err, req, res, next) => {
  if (err && err.statusCode === 400) {
    return errorResponse(res, err.message, { httpCode: 400 });
  }
  next(err);
});

app.use(errorHandler);

module.exports = app;
