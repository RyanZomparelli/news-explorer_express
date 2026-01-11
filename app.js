// The entry point, app.js is like the motherboard of my backend api.
// It connects all the peices and the ordering matters.

// 1. Library dependencies and internal module imports.
const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

// 2. app creation and DB connection.

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/news-explorer_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// 3. Preroute middlewares.

// Once I get routes running, temporarily remove this and make requests to demonstrate what happens without it.
app.use(cors());

// 4. Routes to request processing.

// ...

// 5. Error handling middlewares for things that go wrong in the processing.

// ...

// 6. Starting the server and begin accepting requests.

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
