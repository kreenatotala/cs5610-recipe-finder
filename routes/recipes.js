import express from 'express';

const router = express.Router();

// Sample recipe data
const sampleRecipes = [
    {
        id: 1,
        name: "Classic Scrambled Eggs",
        ingredients: [
            "3 large eggs",
            "2 tablespoons butter",
            "2 tablespoons milk",
            "Salt to taste",
            "Black pepper to taste",
            "Fresh chives (optional)"
        ],
        instructions: "1. Crack eggs into a bowl and whisk with milk, salt, and pepper.\n2. Heat butter in a non-stick pan over medium heat.\n3. Pour in egg mixture and let sit for 20 seconds.\n4. Gently stir with a spatula, pushing eggs from edges to center.\n5. Remove from heat when eggs are slightly runny (they'll continue cooking).\n6. Garnish with chives and serve immediately.",
        category: "Breakfast",
        cookTime: 10,
        servings: 2,
        source: "Instagram"
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439012"),
        name: "Spaghetti Aglio e Olio",
        ingredients: [
            "400g spaghetti",
            "6 cloves garlic, thinly sliced",
            "1/2 cup extra virgin olive oil",
            "1 teaspoon red pepper flakes",
            "1/4 cup fresh parsley, chopped",
            "Salt for pasta water",
            "1/2 cup pasta cooking water",
            "Parmesan cheese (optional)"
        ],
        instructions: "1. Bring a large pot of salted water to boil and cook spaghetti according to package directions.\n2. While pasta cooks, heat olive oil in a large skillet over medium heat.\n3. Add sliced garlic and cook until golden (about 2 minutes), stirring constantly.\n4. Add red pepper flakes and cook for 30 seconds.\n5. Reserve 1/2 cup pasta water, then drain pasta.\n6. Add pasta to the skillet with garlic oil.\n7. Toss everything together, adding pasta water as needed to create a light sauce.\n8. Remove from heat, add parsley, and toss again.\n9. Serve immediately with Parmesan if desired.",
        category: "Dinner",
        cookTime: 20,
        servings: 4,
        source: "Youtube"
    }
];

// GET /api/recipes - Retrieve all recipes
router.get('/recipes', (req, res) => {
  res.json(sampleRecipes);
});

// GET /api/recipes/:id - Retrieve a specific recipe by ID
router.get('/:id', (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  const recipe = sampleRecipes.find(r => r.id === recipeId);
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

export default router;
