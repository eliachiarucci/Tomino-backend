const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    preparationTime: {type: Number, required: true},
    conservation: {Type: Array},
    ingredients: {type: Array, required: true},
    steps: {type: Array, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Recipe", recipeSchema);