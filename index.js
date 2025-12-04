const express = require( 'express');
 const cors = require('cors');
 require('dotenv').config();
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const app = express ();
 const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simple-crud-server.a0arf8b.mongodb.net/?appName=simple-crud-server`;



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

    const coffeesCollection = client.db('cofeeDB').collection('coffees')
// sorting data to array for ease
 app.get('/coffees',async(req,res) =>
{
    const cursor = coffeesCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})
// read opp
app.get('/coffees/:id',async(req,res) =>
    {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollection.findOne(query);
        res.send(result);

    })

    // data sending from ui to here to db
    app.post('/coffees', async (req,res)=>
{
    const newCoffe = req.body;
    console.log(newCoffe);
    const result = await coffeesCollection.insertOne(newCoffe);
    res.send(result);
})

app.put('/coffees/:id', async (req,res) =>
{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true}
    ;
    const uspdatedCoffee = req.body;
    const updatedDoc = {
        $set:uspdatedCoffee
    }
    const result = await coffeesCollection.updateOne(filter,updatedDoc,options);
    res.send(result);

})
//delete op
app.delete('/coffees/:id',async(req,res)=>
{
 const id = req.params.id;
 const query = {_id: new ObjectId(id)}
 const result = await coffeesCollection.deleteOne(query);
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


app.get('/', (req,res) =>{
    res.send('Coffe is getting hotter.')
});

app.listen(port, () => {
    console.log(`Robusta Server is Running on port${port}`)
})

