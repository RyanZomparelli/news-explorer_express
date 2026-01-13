// The entry point, app.js is like the motherboard of my backend api.
// It connects all the pieces and the ordering of these different parts is important.

// 1. Library dependencies and internal module imports.
const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const indexRouter = require("./routes/index.js");

const centralErrorHandler = require("./middlewares/error-handler");

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

// 4. Routes to request controllers.

app.use("/", indexRouter);

// 5. Error handling middlewares for things that go wrong in the processing/controllers.

app.use(centralErrorHandler);

// 6. Starting the server and begin accepting requests.

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
