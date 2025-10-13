// frontend/js/register.js
function $(id) {
  return document.getElementById(id);
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function init() {
  const form = $("registerForm");
  const msg = $("errorMessage");
  const ok = $("successMessage");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msg) msg.textContent = "";
    if (ok) ok.textContent = "";

    const username = $("username").value.trim();
    const firstName = $("firstName").value.trim();
    const lastName = $("lastName").value.trim();
    const password = $("password").value;
    const confirm = $("confirmPassword").value;

    if (!username || !password) {
      if (msg) msg.textContent = "username and password are required";
      return;
    }
    if (password !== confirm) {
      if (msg) msg.textContent = "Passwords do not match";
      return;
    }

    try {
      const user = await postJSON("/api/auth/register", {
        username,
        password,
        firstName,
        lastName,
      });
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (ok) ok.textContent = "Account created! Redirecting...";
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 800);
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
