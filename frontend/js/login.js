function $(s) { return document.querySelector(s); }
async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function init() {
  const form = $('#loginForm');
  const msg = $('#errorMessage');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    const username = form.username.value.trim();
    const password = form.password.value;

    if (!username || !password) {
      msg.textContent = 'Enter username and password.';
      return;
    }

    try {
      const user = await fetchJSON('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = './index.html';
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
