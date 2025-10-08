import express from 'express';
import recipesRouter from './routes/recipes.js';

console.log("Initalizing backend server...");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('frontend'));

app.use('/api/', recipesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});