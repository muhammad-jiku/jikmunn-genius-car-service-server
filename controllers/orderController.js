exports.getOrders = async (req, res, ordersCol) => {
  const decodedEmail = req.decoded.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const query = { email };
    const cursor = ordersCol.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } else {
    res.status(403).send({ message: 'Forbidden access' });
  }
};

exports.createOrder = async (req, res, ordersCol) => {
  const order = req.body;
  const result = await ordersCol.insertOne(order);
  res.send(result);
};
