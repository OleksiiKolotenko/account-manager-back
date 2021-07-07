const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://oleksiy:Resistwater1@cluster0.mo392.mongodb.net/Cluster0?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
