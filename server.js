const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const clientID = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const query = req.query.q;

        // Get access token from Spotify API
        const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to get Spotify access token');
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        // Use the token to search for tracks
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!searchResponse.ok) {
            throw new Error('Failed to fetch tracks from Spotify');
        }

        const searchData = await searchResponse.json();
        res.status(200).json(searchData.tracks.items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};
