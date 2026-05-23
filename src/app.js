const express = require('express');
const path = require('path');

const membershipRoutes = require('./routes/membership');
const informationRoutes = require('./routes/information');
const transactionRoutes = require('./routes/transaction');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded profile images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/', membershipRoutes);
app.use('/', informationRoutes);
app.use('/', transactionRoutes);

// multer error passthrough (file format validation)
app.use((err, req, res, next) => {
  if (err && err.status === 102) {
    return res.status(400).json({ status: 102, message: err.message, data: null });
  }
  next(err);
});

app.use(errorHandler);

module.exports = app;
