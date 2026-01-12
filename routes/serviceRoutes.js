const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

module.exports = (carServices) => {
  router.get('/services', (req, res) => serviceController.getServices(req, res, carServices));
  router.get('/services/:id', (req, res) => serviceController.getServiceById(req, res, carServices));
  router.post('/services', (req, res) => serviceController.createService(req, res, carServices));
  router.delete('/services/:id', (req, res) => serviceController.deleteService(req, res, carServices));
  return router;
};
