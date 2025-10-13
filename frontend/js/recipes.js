function $(s) {
  return document.querySelector(s);
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function renderRecipes(recipes) {
  const container = $("#recipes-container");

  if (!recipes || recipes.length === 0) {
    container.innerHTML = "<p>No recipes found</p>";
    return;
  }

  let html = '<div class="recipe-grid">';

  recipes.forEach((recipe) => {
    html += `
      <div class="recipe-card">
        <h3>${recipe.name}</h3>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions.substring(0, 100)}...</p>
        <button onclick="viewRecipe('${recipe._id}')">View Full Recipe</button>
      </div>
    `;
  });

  html += "</div>";
  container.innerHTML = html;
}

window.viewRecipe = function (recipeId) {
  window.location.href = `./recipe-detail.html?id=${recipeId}`;
};

async function loadRecipes() {
  try {
    const data = await fetchJSON("/api/recipes");
    renderRecipes(data.recipes);
  } catch (err) {
    $("#recipes-container").innerHTML =
      `<p>Error loading recipes: ${err.message}</p>`;
  }
}

function init() {
  loadRecipes();
}

document.addEventListener("DOMContentLoaded", init);
