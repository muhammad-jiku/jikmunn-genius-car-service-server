const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyJwt = require('../middleware/verifyJwt');

module.exports = (orderCollection) => {
  router.get('/orders', verifyJwt, (req, res) => orderController.getOrders(req, res, orderCollection));
  router.post('/orders', (req, res) => orderController.createOrder(req, res, orderCollection));
  return router;
};
