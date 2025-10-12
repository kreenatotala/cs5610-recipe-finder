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

// get recipe by id
router.get('/recipes/:id', async (req, res) => {
  console.log("Received request for /api/recipes/:id");

  try {
    const recipe = await MyDB.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({recipe});
  } catch (error) {
    console.error('Error retrieving recipe:', error);
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
});

// create recipe (post)
router.post('/recipes', async (req, res) => {
  console.log("Received request to create recipe");

  try {
    const { name, ingredients, instructions, category, cookTime, servings, source } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Missing required fields: name, ingredients, instructions' });
    }

    const newRecipe = await MyDB.createRecipe({
      name,
      ingredients,
      instructions,
      category,
      cookTime,
      servings,
      source
    });

    res.status(201).json({recipe: newRecipe});
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// update recipe (put)
router.put('/recipes/:id', async (req, res) => {
  console.log("Received request to update recipe");

  try {
    const updatedRecipe = await MyDB.updateRecipe(req.params.id, req.body);
    
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({recipe: updatedRecipe});
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// delete recipe
router.delete('/recipes/:id', async (req, res) => {
  console.log("Received request to delete recipe");

  try {
    const deleted = await MyDB.deleteRecipe(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});


export default router;