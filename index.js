require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./mainRouter");
const PORT = process.env.PORT;
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/auth", mainRouter);
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Server has started on ${PORT} port`));
  } catch (e) {
    console.log(e);
  }
};

start();
