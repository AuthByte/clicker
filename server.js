require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
const mongoose = require('mongoose');
const User = require('./User'); // Import the User model

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Save user score
app.post('/save-score', async (req, res) => {
    const { userId, score } = req.body;

    try {
        await User.findOneAndUpdate(
            { userId },
            { score },
            { upsert: true, new: true } // Create if not exists
        );
        res.send('Score saved successfully');
    } catch (err) {
        res.status(500).send('Error saving score');
    }
});

// Get global leaderboard
app.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }).limit(10); // Get top 10 users
        res.json(users);
    } catch (err) {
        res.status(500).send('Error retrieving leaderboard');
    }
});