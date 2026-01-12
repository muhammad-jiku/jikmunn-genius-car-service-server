require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello there');
});

app.get('/health', (req, res) => {
  res.send('Hello there! This uri is for health checkup.');
});

// DB Connection and server start
const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function startServer() {
  try {
    await client.connect();
    if (!dbName) {
      console.error('DB_NAME environment variable is not set.');
      process.exit(1);
    }
    const servicesCol = client.db(dbName).collection('svc');
    const ordersCol = client.db(dbName).collection('ord');

    app.use('/api', createRoutes(servicesCol, ordersCol));
    console.log('API routes registered at /api');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB or start server:', err);
    process.exit(1);
  }
}

startServer();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
