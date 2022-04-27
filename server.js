require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
// require('crypto').randomBytes(64).toString('hex')

const app = express();
const port = process.env.PORT || 5001;
const corsOptions = {
  origin: 'https://jikmunn-genius-car-service.web.app/',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello there');
});

app.get('/jiku', (req, res) => {
  res.send('Hello there! This is jiku');
});

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(req.headers);
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    console.log('decoded', decoded);
    req.decoded = decoded;

    next();
  });

  console.log('inside verify jwt', authHeader);
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xgcrx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    const carServices = client.db('geniusCar').collection('services');
    const orderCollection = client.db('ordersCheck').collection('orders');

    // auth
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
      });
      res.send({ accessToken });
    });

    // service section api
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = carServices.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await carServices.findOne(query);
      res.send(service);
    });

    app.post('/services', async (req, res) => {
      const newService = req.body;
      const result = await carServices.insertOne(newService);
      res.send(result);
    });

    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carServices.deleteOne(query);
      res.send(result);
    });

    // order collection section api
    app.get('/orders', verifyJwt, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      // console.log(email);
      if (email === decodedEmail) {
        const query = { email };
        const cursor = orderCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.status(403).send({ message: 'Forbidden access' });
      }
    });

    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
