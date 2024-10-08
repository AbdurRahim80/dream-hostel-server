const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// midleware 
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qgxn6jx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://dreamHostel:HBqd027jA3zBYwjH@cluster0.qgxn6jx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const roomsCollection = client.db('dreamHostel').collection('hostel');
    const bookingCollection = client.db('bookingCollection').collection('bookings');

    // auth
    app.post('/jwt', (req, res)=>{
      const user = req.body;
      console.log(user);
      res.send();
    })

    app.get('/rooms', async(req, res)=>{
        const cursor = roomsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/rooms/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await roomsCollection.findOne(query);
        res.send(result);
    })


    // bookings start
    app.post('/bookings', async(req, res)=>{
      const bookingList = req.body;
      // console.log(bookingList);
      const result = await bookingCollection.insertOne(bookingList);
      res.send(result);
  })

  // app.get('/bookings', async(req, res)=>{
  //   const cursor = bookingCollection.find();
  //   const result = await cursor.toArray();
  //   // console.log(result);
  //   res.send(result);
  // })


  app.get('/bookings', async(req, res)=>{
    const cursor = roomsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

  app.get('/bookings/:email', async(req, res)=>{
    console.log(req.params.email);
    const result = await bookingCollection.find({email: req.params.email}).toArray();
    console.log(result);
    res.send(result);
  })

  app.delete('/bookings/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await bookingCollection.deleteOne(query);
    res.send(result);
  })

  app.get('/bookings/:id', async(req, res)=>{
    const id = req.params.id;
    const cursor = {_id: new ObjectId(id)};
    const result = await bookingCollection.findOne(cursor);
    console.log("rest", result);
    res.send(result);
  })

  app.put('/bookings/:id', async(req, res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const updateSpot = req.body;
    const bookings = {
      $set:{
        date: updateSpot?.startDate
      }
    }
    const result = await bookingCollection.updateOne(filter, bookings, options);
    console.log(result);
    res.send(result)
  })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("server is  running")
})

app.listen(port, () => {
    console.log(`server is rs running port${port}`);
})