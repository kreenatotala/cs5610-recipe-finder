import express from "express";
import MyDB from "../database/myMongoDB.js";

const router = express.Router();

// POST /api/auth/register
// body: { username, password, firstName?, lastName? }
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      firstName = "",
      lastName = "",
    } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "username and password are required" });
    }

    const existing = await MyDB.getUserByUsername(username);
    if (existing) {
      return res.status(409).json({ error: "Username already in use" });
    }

    const created = await MyDB.createUser({
      username,
      password,
      firstName,
      lastName,
    });

    // don’t leak password back
    const publicUser = { ...created };
    delete publicUser.password;
    return res.status(201).json(publicUser);
  } catch (err) {
    console.error("auth/register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
// body: { username, password }
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "username and password are required" });
    }

    const user = await MyDB.verifyUserCredentials(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const publicUser = { ...user };
    delete publicUser.password;
    return res.json(publicUser);
  } catch (err) {
    console.error("auth/login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
