const { Router } = require("express");
const router = Router();
const Recipe = require("../models/recipe.model");
const Comment = require("../models/comments.model");


router.get("/recipe/:recipeID", (req, res) => {
  const {recipeID} = req.params;
  Recipe.findById(recipeID)
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(500).json({message: "Error while retrieving the recipe from the database"}))
})

router.get("/recipes", (req, res) => {
  Recipe.find({})
  .populate("author")
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(500).json({message: "Error while retrieving the recipes from the database"}))
})

router.get("/myrecipes", (req, res) => {
  Recipe.find({author : req.user._id})
  .populate("author")
  .then((data) => res.json(data))
  .catch(() => res.status(500).json({message: "Error while retrievieng your recipes from the database"}))
})

router.post("/recipe/add", (req, res) => {
  const data = req.body;
  data.author = req.user._id;
  console.log(data);
  Recipe.create({...data})
  .then(() => res.status(200).json({message: "everythings good"}))
  .catch(err => res.status(500).json({message: err}));
})

router.post("/recipe/delete", (req, res) => {
  console.log(req.body)
  const {recipeID} = req.body;
  Recipe.findByIdAndDelete(recipeID)
  .then(() => res.status(200).json({message: "everythings good"}))
  .catch(err => res.status(500).json({message: err}));
})

router.post("/recipe/modify/", (req, res) => {
  const data = req.body;
  const {recipeID} = data;
  console.log(data, recipeID, req.user._id)
  console.log(data);
  Recipe.findByIdAndUpdate(recipeID, {...data})
  .then(() => res.status(200).json({message: "everythings good"}))
  .catch(err => res.status(500).json({message: err}));
})

router.post("/recipe/delete", (req, res) => {
  const {recipeID} = req.body;
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

module.exports = router;