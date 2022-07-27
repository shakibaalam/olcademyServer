const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ey7s4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const userCollection = client.db("users").collection("signup");
        const contactCollection = client.db("query").collection("contact");

        // post user
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        //get all contact
        app.get('/contact', async (req, res) => {
            const contacts = await contactCollection.find().toArray();
            res.send(contacts);
        });

        // post contact
        app.post('/contact', async (req, res) => {
            const data = req.body;
            const result = await contactCollection.insertOne(data);
            res.send(result)
        })
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello everyone')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})