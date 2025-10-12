import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

function MyMongoDB({
    DB_NAME = 'recipeFinder',
    COLLECTION_NAME = 'recipes',
    DEFAULT_URI = 'mongodb://localhost:27017',
} = {}) {
    const me = {};
    const URI = process.env.MONGODB_URI || DEFAULT_URI;
    const DB = process.env.DB_NAME || DB_NAME;
    console.log(`Using MongoDB at ${URI}, database: ${DB}`);

    const connect = () => {
        const client = new MongoClient(URI);
        const recipes = client.db(DB_NAME).collection(COLLECTION_NAME);
        const users = client.db(DB).collection('users');

        return { client, recipes, users };
    };

    me.getRecipes = async ({query = {}, pageSize = 20, page = 0} = {}) => {
        const {client, recipes} = connect();

        try {
            const data = await recipes.find(query).limit(pageSize).skip(pageSize*page).toArray();
            console.log('Fetched recipes from MongoDB:', data);
            return data;
        } catch (err) {
            console.error('Error fetching recipes from MongoDB:', err);
            throw err;
        } finally {
            await client.close();
        }
        
    };

    me.getUserByUsernameOrEmail = async (username, email) => {
        const {client, users} = connect();

        try {
            const user = await users.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            });
            return user;
        } catch (err) {
            console.error('Error fetching user from MongoDB:', err);
            throw err;
        } finally {
            await client.close();
        }
    };  

    me.createUser = async ({username, email, password, firstName = '', lastName = ''}) => {
        const {client, users} = connect();

        try {
            const createdAt = new Date();
            const doc = {
                username,
                email,
                password, // In a real app, ensure this is hashed!
                firstName,
                lastName,
                createdAt,
            };
            const result = await users.insertOne(doc);
            console.log('Created user in MongoDB with id:', result.insertedId);
            // Return the created document with the generated _id
            return { _id: result.insertedId, ...doc };
        } catch (err) {
            console.error('Error creating user in MongoDB:', err);
            throw err;
        } finally {
            await client.close();
        }
    };
    
    me.verifyUserCredentials = async (username, password) => {
        const {client, users} = connect();
        try {
            const user = await users.findOne({ username: username });
            if (user && user.password === password) { // In a real app, use hashed password comparison
                return user;
            }
            return null;
        } catch (err) {
            console.error('Error verifying user credentials in MongoDB:', err);
            throw err;
        } finally {
            await client.close();
        }
    };

    return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;