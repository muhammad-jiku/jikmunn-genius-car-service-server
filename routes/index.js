const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const createServiceRoutes = require('./serviceRoutes');
const createOrderRoutes = require('./orderRoutes');

// These functions require the collections, so we export a function to accept them
module.exports = (servicesCol, ordersCol) => {
  router.use('/auth', authRoutes); // /auth/login
  router.use('/', createServiceRoutes(servicesCol));
  router.use('/', createOrderRoutes(ordersCol));
  return router;
};
