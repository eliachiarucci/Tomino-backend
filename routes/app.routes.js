const { Router } = require("express");
const router = Router();
const Recipe = require("../models/recipe.model");
const Comment = require("../models/comment.model");


router.get("/recipe", (req, res) => {
  const {recipeID} = req.body;
  Recipe.findById(recipeID)
  .then(() => res.status(200).send(recipeID))
  .catch(() => res.status(500).send("Error while retrieving the recipe in the database"))
})

router.post("/recipe/add", (req, res) => {
  const {name, description, ingredients, steps } = req.body;
  Recipe.create({name, description, ingredients, steps})
  .catch(err => res.status(500).send("Error while adding new recipe in the database"));
})

router.post("/recipe/delete", (req, res) => {
  const {recipeID} = req.body;
  // Check if logged user corresponds to owner of the recipe;
  Recipe.findByIdAndDelete(recipeID)
  .then(() => res.status(200))
  .catch(err => res.status(500).send("Error while deleting the recipe from the database"));
})

router.post("/recipe/update", (req, res) => {
  const {recipeID} = req.body;
  Recipe.findByIdAndUpdate(recipeID, {...newData})
  .then(() => res.status(200))
  .catch(() => res.status(500).send("Error while updating the recipe in the database"))
})

router.post("/recipe/comment/add", (req, res) => {
  const {recipeID, userID, comment} = req.body;
  Comment.create({comment, author: userID})
  .then(() => res.status(200).send("Comment added succesfully"))
  .catch((err) => res.status(500).send("Error while adding new comment"))
})

router.post("/recipe/comment/modify", (req, res) => {
  const {recipeID, userID, commentID, modifiedComment} = req.body;
  
})