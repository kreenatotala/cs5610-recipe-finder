import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

function MyMongoDB({
  DB_NAME = "recipeFinder",
  COLLECTION_NAME = "recipes",
  DEFAULT_URI = "mongodb://localhost:27017",
} = {}) {
  const me = {};
  const URI = process.env.MONGODB_URI || DEFAULT_URI;
  const DB = process.env.DB_NAME || DB_NAME;
  console.log(`Using MongoDB at ${URI}, database: ${DB}`);

  const connect = () => {
    const client = new MongoClient(URI);
    const recipes = client.db(DB).collection(COLLECTION_NAME);
    const users = client.db(DB).collection("users");

    return { client, recipes, users };
  };

  me.getRecipes = async ({ query = {}, pageSize = 100, page = 0 } = {}) => {
    const { client, recipes } = connect();

    try {
      const data = await recipes
        .find(query)
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * page)
        .toArray();
      console.log("Fetched recipes from MongoDB:", data);
      return data;
    } catch (err) {
      console.error("Error fetching recipes from MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.getRecipeById = async (recipeId) => {
    const { client, recipes } = connect();

    try {
      const recipe = await recipes.findOne({ _id: new ObjectId(recipeId) });
      console.log("Fetched recipe from MongoDB:", recipe);
      return recipe;
    } catch (err) {
      console.error("Error fetching recipe from MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.createRecipe = async ({
    name,
    ingredients,
    instructions,
    category,
    cookTime,
    servings,
    source,
  }) => {
    const { client, recipes } = connect();

    try {
      const createdAt = new Date();
      const doc = {
        name,
        ingredients,
        instructions,
        category: category || "Uncategorized",
        cookTime: parseInt(cookTime) || 0,
        servings: parseInt(servings) || 1,
        source: source || "",
        createdAt,
        updatedAt: createdAt,
      };
      const result = await recipes.insertOne(doc);
      console.log("Created recipe in MongoDB with id:", result.insertedId);
      return { _id: result.insertedId, ...doc };
    } catch (err) {
      console.error("Error creating recipe in MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.updateRecipe = async (recipeId, updateData) => {
    const { client, recipes } = connect();

    try {
      const update = {
        ...updateData,
        updatedAt: new Date(),
      };

      const result = await recipes.updateOne(
        { _id: new ObjectId(recipeId) },
        { $set: update },
      );

      if (result.matchedCount === 0) {
        return null;
      }

      console.log("Updated recipe in MongoDB:", recipeId);
      return await me.getRecipeById(recipeId);
    } catch (err) {
      console.error("Error updating recipe in MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.deleteRecipe = async (recipeId) => {
    const { client, recipes } = connect();

    try {
      const result = await recipes.deleteOne({ _id: new ObjectId(recipeId) });
      console.log("Deleted recipe from MongoDB:", recipeId);
      return result.deletedCount > 0;
    } catch (err) {
      console.error("Error deleting recipe from MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.getUserByUsername = async (username) => {
    const { client, users } = connect();
    try {
      const user = await users.findOne({ username });
      return user;
    } catch (err) {
      console.error("Error fetching user by username from MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.createUser = async ({
    username,
    password,
    firstName = "",
    lastName = "",
  }) => {
    const { client, users } = connect();
    try {
      const createdAt = new Date();
      const doc = {
        username,
        // NOTE: you said keep it simple for class project — this remains plain text like your original.
        // In production you'd hash this.
        password,
        firstName,
        lastName,
        createdAt,
      };
      const result = await users.insertOne(doc);
      console.log("Created user in MongoDB with id:", result.insertedId);
      return { _id: result.insertedId, ...doc };
    } catch (err) {
      console.error("Error creating user in MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  me.verifyUserCredentials = async (username, password) => {
    const { client, users } = connect();
    try {
      const user = await users.findOne({ username });
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (err) {
      console.error("Error verifying user credentials in MongoDB:", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;
