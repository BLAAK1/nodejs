const express = require("express");
const app = express();
require("dotenv").config();
const uri = process.env.URI;
const { MongoClient, ServerApiVersion } = require("mongodb");
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;

  const date = `${new Date().getDate()}.${
    new Date().getMonth() + 1
  }.${new Date().getFullYear()}`;
  const data = { name, email, message, date };
  async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
      const collection = client
        .db("CustomersMessages")
        .collection("CustomersMessages");
      await collection.insertOne(data, (err, result) => {
        console.log("Insterting data!");
        if (err) {
          console.error("Failed to insert document:", err);
          return;
        }

        console.log("Document inserted successfully");
      });
    } finally {
      console.log("Closing connection!");
      await client.close();
    }
  }
  run().catch(console.dir);
  res.redirect("/form.html");
});
