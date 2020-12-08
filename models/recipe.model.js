const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    title: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    preparationtime: {type: Number, required: true},
    conservationtimes: {type: Array},
    ingredients: {type: Array, required: true},
    steps: {type: Array, required: true},
    tags: {type: Array},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: false}]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Recipe", recipeSchema);