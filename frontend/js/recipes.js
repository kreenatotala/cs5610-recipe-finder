function $(s) {
  return document.querySelector(s);
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

let allRecipes = [];

function renderRecipes(recipes) {
  const container = $("#recipes-container");

  if (!recipes || recipes.length === 0) {
    container.innerHTML = "<p>No recipes found</p>";
    return;
  }

  let html = '<div class="recipe-grid">';

  recipes.forEach((recipe) => {
    // build source display: if recipe.source is a URL show favicon + link, otherwise plain text
    let sourceHtml = "";
    try {
      const url = new URL(recipe.source);
      const hostname = url.hostname.replace("www.", "");
      // Google favicon service for small site icons
      const favicon = `https://www.google.com/s2/favicons?domain=${hostname}`;
      sourceHtml = `<span class="source">
          <img class="source-favicon" src="${favicon}" alt="${hostname} logo" />
          <a href="${recipe.source}" target="_blank" rel="noopener noreferrer">${hostname}</a>
        </span>`;
    } catch {
      // not a url, just display the raw source
      sourceHtml = `<span class="source-text">${recipe.source || ""}</span>`;
    }

    html += `
      <div class="recipe-card">
        <h3>${recipe.name}</h3>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions.substring(0, 100)}...</p>
        <p><strong>Source:</strong> ${sourceHtml}</p>
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
    allRecipes = data.recipes || [];
    renderCategoryFilters(allRecipes);
    renderRecipes(allRecipes);
  } catch (err) {
    $("#recipes-container").innerHTML =
      `<p>Error loading recipes: ${err.message}</p>`;
  }
}

function renderCategoryFilters(recipes) {
  const container = document.getElementById("category-filters");
  if (!container) return;
  const categories = Array.from(
    new Set((recipes || []).map((r) => r.category).filter(Boolean)),
  );
  // simple buttons
  let html = '<button data-cat="all" class="filter-button">All</button> ';
  categories.forEach((cat) => {
    html += `<button data-cat="${cat}" class="filter-button">${cat}</button> `;
  });
  container.innerHTML = html;
  container.querySelectorAll(".filter-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cat = e.currentTarget.getAttribute("data-cat");
      if (cat === "all") renderRecipes(allRecipes);
      else renderRecipes(allRecipes.filter((r) => r.category === cat));
    });
  });
}

function init() {
  loadRecipes();
}

document.addEventListener("DOMContentLoaded", init);
