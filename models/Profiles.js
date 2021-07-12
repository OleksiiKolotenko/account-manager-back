const { Schema, model } = require("mongoose");

const Profile = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: Date, required: true },
  city: { type: String, required: true },
  user_id: { type: String, required: true },
});

module.exports = model("Profile", Profile);
