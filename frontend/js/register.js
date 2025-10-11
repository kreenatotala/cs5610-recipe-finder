// frontend/js/register.js
function $(id) { return document.getElementById(id); }
console.log("Initalizing register.js...");

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function init() {
  const form = $('registerForm');
  console.log("Register form:", form);
  const msg = $('errorMessage');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) msg.textContent = '';

    const username = $('username').value.trim();
    const email = $('email').value.trim();
    const firstName = $('firstName').value.trim();
    const lastName = $('lastName').value.trim();
    const password = $('password').value;
    const confirm = $('confirmPassword').value;
    console.log("Registering user:", username, email, firstName, lastName, password, confirm);
    console.log(typeof username, typeof email, typeof password, typeof confirm);
    console.log(!username, !email, !password);

    if (!username || !email || !password) {
      if (msg) msg.textContent = 'username, email, and password are required';
      return;
    }
    if (password !== confirm) {
      if (msg) msg.textContent = 'Passwords do not match';
      return;
    }

    try {
      const user = await postJSON('/api/auth/register', { username, email, firstName, lastName, password });
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = './index.html';
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
