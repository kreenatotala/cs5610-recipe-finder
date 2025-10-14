# Recipe Finder

A simple, student-built web app to browse, add, view, and delete recipes. The backend exposes JSON APIs with Node.js + Express + MongoDB, and the UI is rendered on the client with **vanilla JavaScript** modules.

---

## Authors
- **Kreena Totala**
- **Swar Kewalia**

## Class Link
- https://johnguerra.co/classes/webDevelopment_online_fall_2025/

## Project Objective
Build a small full‑stack app that demonstrates:
- Node.js + Express server with REST endpoints
- MongoDB persistence (recipes + users)
- Client‑side rendering with vanilla JS (no frameworks)
- Basic auth (register, login, logout) and gated actions (add and delete recipe only when logged in)
- Clean repo structure, ESLint + Prettier, and simple deploy

---

## Screenshot
<img width="1411" height="676" alt="Screenshot 2025-10-13 at 11 32 29 PM" src="https://github.com/user-attachments/assets/57e3f783-b654-4eb2-977c-de6801a7ed42" />
<img width="1411" height="654" alt="Screenshot 2025-10-13 at 11 32 40 PM" src="https://github.com/user-attachments/assets/5c8919ff-29fc-469c-83e5-9f5fbe4113eb" />
<img width="973" height="636" alt="Screenshot 2025-10-13 at 11 32 59 PM" src="https://github.com/user-attachments/assets/1f2c9e39-bf1a-408d-b6c5-a3509034afbb" />
<img width="601" height="557" alt="Screenshot 2025-10-13 at 11 33 10 PM" src="https://github.com/user-attachments/assets/69c70c2b-aa15-4820-8f49-311987a3f4c9" />
<img width="814" height="534" alt="Screenshot 2025-10-13 at 11 33 18 PM" src="https://github.com/user-attachments/assets/f35c3f66-bf20-4538-b79b-3f2fda3922c1" />


---

## Tech Stack
- **Frontend:** HTML + CSS + vanilla JS (ES modules) — client‑side DOM rendering
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Lint/Format:** ESLint + Prettier
- **Environment:** `.env` for secrets (no credentials committed)

---

## Project Structure (high‑level)
```
Project2/
├─ backend.js                # Express app (ESM)
├─ routes/                   # API routes (recipes, users)
├─ database/
│  └─ myMongoDB.js          # Thin DB helper (recipes & users)
├─ frontend/
│  ├─ index.html            # Landing / nav
│  ├─ recipes.html          # Browse recipes (client-side render)
│  ├─ add-recipe.html       # Add form (gated by auth)
│  ├─ recipe-detail.html    # Detail view
│  └─ js/
│     ├─ frontend.js        # Glue / common helpers
│     ├─ recipes.js         # Fetch + render recipe list
│     ├─ add-recipe.js      # Add flow + gate when not logged in
│     ├─ recipe-detail.js   # Fetch + render single recipe
│     ├─ login.js           # Login
│     ├─ register.js        # Register
│     └─ auth-state.js      # Logged-in banner + gating
├─ public/                   # Static assets (if any)
├─ .env                      # Local env vars (not committed)
├─ package.json
├─ eslint.config.js or .eslintrc.*
└─ README.md
```

---

## Prerequisites
- **Node.js** 18+
- **MongoDB** running locally (`mongodb://localhost:27017`) or an **Atlas** cluster
- **npm**

---

## Environment Variables
Create a `.env` at the project root with:
```
# Local dev example
MONGODB_URI=mongodb://localhost:27017
DB_NAME=recipeFinder
PORT=3000
```

For Atlas, set:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net
DB_NAME=recipeFinder
PORT=3000
```

> Do not commit `.env`. The app reads these in `database/myMongoDB.js` and `backend.js`.

---

## Install & Build Instructions

1) **Install dependencies**
```bash
npm install
```

2) **Run ESLint / Prettier (optional but recommended)**
```bash
# Lint
npx eslint . --ext .js,.mjs

# Format
npx prettier . --write
```

3) **Start MongoDB**
- Local: ensure `mongod` is running
- Atlas: verify your IP allowlist and credentials

4) **Start the server**
```bash
node backend.js
# or if you use nodemon:
# npx nodemon backend.js
```

5) **Open the frontend**
- Navigate to: `http://localhost:3000/`
- Pages are served from `/frontend` (e.g., `/frontend/recipes.html`) or via links on the index.

---

## Deployment

It is also deployed publicly using `Render` at this URL:  https://cs5610-recipe-finder.onrender.com/ 

---

## Usage Notes
- **Client-side rendering:** All recipe lists/details are rendered in the browser by vanilla JS using data from `/api/*`.
- **Auth:** After a successful login/register, the user object is stored in `localStorage` (`currentUser`). The “Add Recipe” page is **gated**: if not logged in, the form is hidden and a message with links to Login/Register is shown. Same when a user tries to delete a recipe without authentication. 
- **Data model:** Recipes stored in MongoDB with `createdAt`/`updatedAt`. Listing defaults to newest first for visibility.

---

## Credits
This app was built for **CS5610** as a two‑person project with a focus on simplicity, clear structure, and working features over production hardening. Assets were generated using Sora with the following prompt `create three different images of pixelated foods`. 
