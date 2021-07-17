const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: { type: String, ref: "Role" },
});

User.set("toJSON", {
  transform(_, obj) {
    delete obj.password;
    return obj;
  },
});

module.exports = model("User", User);
