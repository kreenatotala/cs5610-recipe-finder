import express from 'express';
import MyDB from '../database/myMongoDB.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { username, email, password, firstName, lastName }
 * Returns: { user }  // without password
 */
router.post('/register', async (req, res) => {
    console.log("Received request for /api/auth/register");
  try {
    const { username, email, password, firstName = '', lastName = '' } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }

    // Let MyDB own user lookups and creation
    const existing = await MyDB.getUserByUsernameOrEmail(username, email);
    if (existing) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    const created = await MyDB.createUser({
      username,
      email,
      password, // keep whatever hashing/handling MyDB implements; we’re not changing MyDB
      firstName,
      lastName,
    });

    // Ensure we don’t leak password back
    const { password: _pw, ...publicUser } = created || {};
    return res.status(201).json({ user: publicUser });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return res.status(500).json({ error: 'Registration failed, internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { user }  // without password
 */
router.post('/login', async (req, res) => {
    console.log("Received request for /api/auth/login");
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    // Delegate auth to MyDB (it can compare hashed or plain, depending on its final impl)
    const user = await MyDB.verifyUserCredentials(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _pw, ...publicUser } = user;
    return res.json({ user: publicUser });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return res.status(500).json({ error: 'Login failed, internal server error' });
  }
});

/**
 * GET /api/auth/user/:username
 * Returns: { user }  // without password
 * (Handy for fetching a profile by username)
 */
router.get('/user/:username', async (req, res) => {
    console.log("Received request for /api/auth/user/:username");
  try {
    const { username } = req.params;
    const user = await MyDB.getUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password: _pw, ...publicUser } = user;
    return res.json({ user: publicUser });
  } catch (error) {
    console.error('Error in /api/auth/user/:username:', error);
    return res.status(500).json({ error: 'Failed to retrieve user, internal server error' });
  }
});

export default router;
