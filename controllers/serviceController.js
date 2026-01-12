const { ObjectId } = require('mongodb');

exports.getServices = async (req, res, servicesCol) => {
  const query = {};
  const cursor = servicesCol.find(query);
  const services = await cursor.toArray();
  res.send(services);
};

exports.getServiceById = async (req, res, servicesCol) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const service = await servicesCol.findOne(query);
  res.send(service);
};

exports.createService = async (req, res, servicesCol) => {
  const newService = req.body;
  const result = await servicesCol.insertOne(newService);
  res.send(result);
};

exports.deleteService = async (req, res, servicesCol) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await servicesCol.deleteOne(query);
  res.send(result);
};
