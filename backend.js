import express from 'express';
import recipesRouter from './routes/recipes.js';
import authRoutes from './routes/users.js';

console.log("Initalizing backend server...");
const PORT = process.env.PORT || 3000;
const app = express();

// Parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('frontend'));

app.use('/api/', recipesRouter);

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});