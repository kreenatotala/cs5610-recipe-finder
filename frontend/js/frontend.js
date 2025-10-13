function Recipes() {
  const me = {};

  me.showError = (msg, response, role = "danger") => {
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-${role}`;
    alert.role = role;
    alert.innerText = `${msg}: ${response.status} ${response.statusText}`;
    main.prepend(alert);
  };

  me.refreshRecipes = async function () {
    // Fetch and display recipes
    const res = await fetch("/api/recipes");
    if (!res.ok) {
      console.error("Failed to fetch recipes", res.status, res.statusText);
      me.showError("Failed to fetch recipes", res, "alert");
      return;
    }

    const recipes = await res.json();
    console.log("Fetched recipes:", recipes);
  };
  return me;
}

const myRecipes = Recipes();

myRecipes.refreshRecipes();

export default Recipes;
