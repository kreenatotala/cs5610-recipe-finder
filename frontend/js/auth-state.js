function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

function renderBanner() {
  const box = document.getElementById("nav-auth");
  if (!box) return;
  box.innerHTML = "";
  const user = getCurrentUser();
  if (user && user.username) {
    const span = document.createElement("span");
    span.textContent = "Welcome, " + user.username;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Logout";
    btn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
    box.append(span, document.createTextNode(" "), btn);
  } else {
    const a1 = document.createElement("a");
    a1.href = "./login.html";
    a1.textContent = "Login";
    const a2 = document.createElement("a");
    a2.href = "./register.html";
    a2.textContent = "Register";
    box.append(a1, document.createTextNode(" | "), a2);
  }
}

function gateAddRecipe() {
  const user = getCurrentUser();
  const notice = document.getElementById("authNotice");
  const addBtn = document.getElementById("addRecipeBtn");
  const addForm = document.getElementById("addRecipeForm");

  function requireLogin(e) {
    e.preventDefault();
    if (notice) {
      notice.textContent = "Please log in to add a recipe.";
    } else {
      alert("Please log in to add a recipe.");
    }
    window.location.href = "./login.html";
  }

  if (!user) {
    if (addBtn) addBtn.addEventListener("click", requireLogin, { once: true });
    if (addForm)
      addForm.addEventListener("submit", requireLogin, { once: true });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderBanner();
  gateAddRecipe();
});
