const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let leaderboard = [];
let nextUpdateTime = new Date(Date.now() + 60000); // Set initial next update time to 1 minute from now

// Endpoint to get the leaderboard
app.get('/leaderboard', (req, res) => {
    res.json({ leaderboard, nextUpdateTime });
});

// Endpoint to update the leaderboard
app.post('/leaderboard', (req, res) => {
    const { userId, score } = req.body;

    // Update or add the user score
    const existingUser = leaderboard.find(user => user.id === userId);
    if (existingUser) {
        existingUser.score = Math.max(existingUser.score, score); // Keep the highest score
    } else {
        leaderboard.push({ id: userId, score });
    }

    // Sort leaderboard by score
    leaderboard.sort((a, b) => b.score - a.score);
    res.json(leaderboard);
});

// Function to update the leaderboard
function updateLeaderboard() {
    // Logic to update the leaderboard, e.g., fetching from a database
    console.log("Leaderboard updated!");
    
    // Update the next update time
    nextUpdateTime = new Date(Date.now() + 60000); // Set to 1 minute from now
}

// Schedule the leaderboard update every minute
cron.schedule('* * * * *', updateLeaderboard); // Every minute

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
