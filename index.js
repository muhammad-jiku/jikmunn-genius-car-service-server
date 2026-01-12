require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const createRoutes = require('./routes');
// require('crypto').randomBytes(64).toString('hex')

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello there');
});

app.get('/health', (req, res) => {
  res.send('Hello there! This is uri is for health checkup.');
});

// DB Connection
const uri = `${process.env.DB_URI}`;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      console.error('DB_NAME environment variable is not set.');
      return;
    }
    const servicesCol = client.db(dbName).collection('svc');
    const ordersCol = client.db(dbName).collection('ord');

    // All routes under /api
    app.use('/api', createRoutes(servicesCol, ordersCol));
    console.log('API routes registered at /api');
  } catch (err) {
    console.error('Failed to connect to MongoDB or register routes:', err);
  }
};
run().catch((err) => {
  console.error('Unexpected error during server startup:', err);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
