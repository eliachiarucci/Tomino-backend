const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    image: {type: String, required: true},
    tensorjson: {type: String, required: false},
    tensorbin: {type: String, required: false}
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);