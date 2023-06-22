const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://zegaroskar:Zaq12wsxcdv123@test.i9x3rov.mongodb.net/?retryWrites=true&w=majority";

app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.post("/form", async (req, res) => {
  const { name, email, message } = req.body;

  const date = `${new Date().getDate()}, ${new Date().getMonth() + 1}, ${new Date().getFullYear()}`;
  const data = { name, email, message, date };

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const collection = await client.db("CustomersMessages").collection("CustomersMessages");
    await collection.insertOne(data);
    console.log("Data inserted successfully");

    res.redirect("/homepage.html"); // Redirect after data insertion
  } catch (err) {
    console.error("Failed to insert document:", err);
    // Handle error if data insertion fails
  } finally {
    console.log("Closing connection!");
    await client.close();
  }
});
