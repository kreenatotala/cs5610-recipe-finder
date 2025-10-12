function $(s) { return document.querySelector(s); }

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function displayRecipe(recipe) {
  const container = $('#recipe-detail');
  
  const ingredientsList = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')
    : `<li>${recipe.ingredients}</li>`;
  
  container.innerHTML = `
    <h1>${recipe.name}</h1>
    
    <div class="recipe-meta">
      <p><strong>Category:</strong> ${recipe.category}</p>
      <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
      ${recipe.source ? `<p><strong>Source:</strong> <a href="${recipe.source}" target="_blank">${recipe.source}</a></p>` : ''}
    </div>

    <div class="recipe-section">
      <h2>Ingredients</h2>
      <ul>${ingredientsList}</ul>
    </div>

    <div class="recipe-section">
      <h2>Instructions</h2>
      <p>${recipe.instructions}</p>
    </div>

    <button onclick="deleteRecipe('${recipe._id}')">Delete Recipe</button>
  `;
}

window.deleteRecipe = async function(recipeId) {
  if (!confirm('Are you sure you want to delete this recipe?')) {
    return;
  }

  try {
    await fetchJSON(`/api/recipes/${recipeId}`, { method: 'DELETE' });
    alert('Recipe deleted successfully!');
    window.location.href = './recipes.html';
  } catch (err) {
    alert(`Error deleting recipe: ${err.message}`);
  }
};

async function loadRecipeDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  
  if (!recipeId) {
    $('#recipe-detail').innerHTML = '<p>No recipe ID provided</p>';
    return;
  }

  try {
    const data = await fetchJSON(`/api/recipes/${recipeId}`);
    displayRecipe(data.recipe);
  } catch (err) {
    $('#recipe-detail').innerHTML = `<p>Error loading recipe: ${err.message}</p>`;
  }
}

function init() {
  loadRecipeDetail();
}

document.addEventListener('DOMContentLoaded', init);