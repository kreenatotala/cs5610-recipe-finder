function $(s) {
  return document.querySelector(s);
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function showGateMessage() {
  // Hide the form and show a friendly gate with links
  const form = $("#addRecipeForm");
  if (form) form.style.display = "none";

  let gate = document.getElementById("authGate");
  if (!gate) {
    gate = document.createElement("div");
    gate.id = "authGate";
    const container = form?.parentElement || document.body;
    container.insertBefore(gate, form || container.firstChild);
  }

  gate.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = "You need to log in or register to add a recipe.";
  const links = document.createElement("p");
  const login = document.createElement("a");
  login.href = "./login.html";
  login.textContent = "Login";
  const sep = document.createTextNode(" | ");
  const reg = document.createElement("a");
  reg.href = "./register.html";
  reg.textContent = "Register";
  links.append(login, sep, reg);

  gate.append(p, links);
}

function init() {
  const form = $("#addRecipeForm");
  const errorMsg = $("#errorMessage");
  const successMsg = $("#successMessage");
  if (!form) return;

  // Gate: if not logged in, hide the form and show links (no redirect)
  const user = getCurrentUser();
  if (!user) {
    if (errorMsg) errorMsg.textContent = "";
    if (successMsg) successMsg.textContent = "";
    showGateMessage();
    return;
  }

  // Logged in → enable form submit
  form.style.display = "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.textContent = "";
    if (successMsg) successMsg.textContent = "";

    const name = $("#name").value.trim();
    const category = $("#category").value;
    const cookTime = $("#cookTime").value;
    const servings = $("#servings").value;
    const source = $("#source").value.trim();
    const ingredientsText = $("#ingredients").value.trim();
    const instructions = $("#instructions").value.trim();

    if (
      !name ||
      !ingredientsText ||
      !instructions ||
      !cookTime ||
      !servings ||
      !category ||
      !source
    ) {
      if (errorMsg) errorMsg.textContent = "Please fill in all fields.";
      return;
    }

    const ingredients = ingredientsText
      .split("\n")
      .map((ing) => ing.trim())
      .filter(Boolean);

    try {
      await fetchJSON("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          cookTime,
          servings,
          source,
          ingredients,
          instructions,
        }),
      });
      if (successMsg) successMsg.textContent = "Recipe added successfully!";
      setTimeout(() => {
        window.location.href = "./recipes.html";
      }, 1000);
    } catch (err) {
      if (errorMsg) errorMsg.textContent = err.message;
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
