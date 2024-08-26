const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = "mongodb+srv://yousofali293:@cluster0.lewcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    
    // creat a database client 
    const database = client.db("myDB");
    const userCollections = database.collection("USERS");


     // get all data from database 
     app.get('/users',async(req,res) => {
        const cursor = userCollections.find();
        const users = await cursor.toArray();
        res.send(users)
    })

    // get one data 
    app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const user = await userCollections.findOne(query)
            res.send(user);
    })

    // update one data 
    app.put("/users/:id", async(req,res) => {
        const id = req.params.id;
        const user = req.body;
        console.log(id,user);

        const query = {_id: new ObjectId(id)}
        const option = {upsert: true}

        const updateUser = {
          $set: {
            name:user.name,
            email:user.email
          }
        };

        const result = await userCollections.updateOne(query, updateUser, option);
        res.send(result);
    })
    
    // add data in database 
    app.post('/users', async(req,res) =>{
        const user = req.body
        console.log(user)
        const result = await userCollections.insertOne(user);
        res.send(result);
    })


    // remove from database 
    app.delete('/users/:id', async(req,res) => {
        const id = req.params.id;
        console.log(id);
        const query = {_id: new ObjectId(id)}
        const result = await userCollections.deleteOne(query);
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



app.get("/",(req,res) => {
    res.send("simple crud is running");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})