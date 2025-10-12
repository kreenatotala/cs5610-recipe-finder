function $(s) { return document.querySelector(s); }

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function init() {
  const form = $('#addRecipeForm');
  const errorMsg = $('#errorMessage');
  const successMsg = $('#successMessage');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    successMsg.textContent = '';

    const name = form.name.value.trim();
    const category = form.category.value;
    const cookTime = form.cookTime.value;
    const servings = form.servings.value;
    const source = form.source.value.trim();
    const ingredientsText = form.ingredients.value.trim();
    const instructions = form.instructions.value.trim();

    if (!name || !ingredientsText || !instructions || !cookTime || !servings || !category || !source) {
      errorMsg.textContent = 'Please fill in all fields.';
      return;
    }

    const ingredients = ingredientsText.split('\n').map(ing => ing.trim()).filter(ing => ing.length > 0);

    try {
      const recipe = await fetchJSON('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          cookTime: parseInt(cookTime),
          servings: parseInt(servings),
          source,
          ingredients,
          instructions
        })
      });

      successMsg.textContent = 'Recipe added successfully!';
      setTimeout(() => {
        window.location.href = './recipes.html';
      }, 1500);
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);