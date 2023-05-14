const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('chocolate server running');
})


// ---------------------
//        Mongo CODE STARTS HERE
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1o3onh9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    await client.connect();


    // insert/create DATA OPERATION
    const database = client.db("chocolateDB");
    const chocolateCollection = database.collection("chocolates");
    app.post('/chocolates', async (req, res) => {
      const item = req.body;
      const result = await chocolateCollection.insertOne(item);
      res.send(result);
    })

    // read DATA OPERATION
    app.get('/chocolates', async (req, res) => {
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//        Mongo CODE ENDS HERE
// ---------------------

app.listen(port, () => {
  console.log('server running');
});
