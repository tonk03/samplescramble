// src/app.js
require('dotenv').config();  // Load environment variables
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

// Function to get access token from Spotify
async function getAccessToken() {
    const clientID = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        },
        body: 'grant_type=client_credentials'
    };

    const response = await fetch(tokenUrl, requestOptions);
    const data = await response.json();
    return data.access_token;
}

// Endpoint to search for tracks
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const token = await getAccessToken();
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
        const searchOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await fetch(searchUrl, searchOptions);
        const data = await response.json();
        res.json(data.tracks.items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
