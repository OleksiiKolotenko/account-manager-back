require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
