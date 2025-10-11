import {MongoClient} from 'mongodb';

function myMongoDB({
    DB_NAME = 'recipeFinder',
    COLLECTION_NAME = 'recipes',
    DEFAULT_URI = 'mongodb://localhost:27017',
} = {}) {
    const me = {};
    const URI = process.env.MONGODB_URI || DEFAULT_URI;

    const connect = () => {
        const client = new MongoClient(URI);
        const recipes = client.db(DB_NAME).collection(COLLECTION_NAME);

        return { client, recipes };
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

    return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;