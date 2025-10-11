import express from 'express';
import MyDB from '../database/myMongoDB.js';

const router = express.Router();

// GET /api/recipes - Retrieve all recipes
router.get('/recipes', async (req, res) => {
  console.log("Received request for /api/recipes");

  try {
    const recipes = await MyDB.getRecipes();
    res.json({recipes});
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes, internal server error', recipes: [] });
  }
});

export default router;