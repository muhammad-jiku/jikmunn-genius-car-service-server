// seed.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.DB_URI;
const client = new MongoClient(uri);


const servicesSeed = [
  {
    name: 'Oil Change',
    description: 'Complete oil and filter change',
    price: 49.99,
    duration: '30 min',
    available: true
  },
  {
    name: 'Tire Rotation',
    description: 'Rotation of all four tires',
    price: 29.99,
    duration: '20 min',
    available: true
  },
  {
    name: 'Brake Inspection',
    description: 'Comprehensive brake system check',
    price: 39.99,
    duration: '25 min',
    available: true
  }
];


// Orders will be created after inserting services, referencing their _id

async function seed() {
  try {
    await client.connect();
    const db = client.db();
    const servicesCol = db.collection('svc');
    const ordersCol = db.collection('ord');
    await servicesCol.deleteMany({});
    await ordersCol.deleteMany({});
    const serviceInsertResult = await servicesCol.insertMany(servicesSeed);
    const insertedServices = Object.values(serviceInsertResult.insertedIds).map((id, idx) => ({
      _id: id,
      ...servicesSeed[idx]
    }));

    const ordersSeed = [
      {
        serviceId: insertedServices[0]._id,
        customer: 'John Doe',
        email: 'john@example.com',
        date: '2026-01-12',
        status: 'pending',
        price: insertedServices[0].price
      },
      {
        serviceId: insertedServices[1]._id,
        customer: 'Jane Smith',
        email: 'jane@example.com',
        date: '2026-01-13',
        status: 'completed',
        price: insertedServices[1].price
      }
    ];
    await ordersCol.insertMany(ordersSeed);
    console.log('Seed data for services and orders inserted successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
