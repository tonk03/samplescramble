# SampleScramble

**SampleScramble** is a music guessing game where players identify the original songs behind samples in popular tracks. Listen, guess, and test your knowledge of modern music.

## Play Now  
[SampleScramble](https://samplescramble.vercel.app/)

## Features  
- **Search for songs** using Spotify’s Web API  
- **Identify original songs** sampled in popular tracks  
- **Fast performance** with backend API requests  
- **Deployed on Vercel** for scalability  

## Tech Stack  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **API:** Spotify Web API (OAuth 2.0)  
- **Deployment:** Vercel  

## How It Works  
1. **Player Searches for Tracks**:  
   - The player initiates a search by entering a query (e.g., a song name) in the app.  
   - The query is sent to the backend via the /api/search endpoint.  

2. **Backend Handles Spotify API Authentication**:  
   - The backend (**Node.js + Express.js**) uses **OAuth 2.0** to request an access token from Spotify.  
   - The access token is obtained by sending a POST request to Spotify’s token endpoint with the app’s client credentials.  

3. **Fetching Track Data from Spotify**:  
   - Once the access token is obtained, the backend sends a GET request to Spotify’s Web API to search for tracks matching the player’s query.  
   - The search results (tracks) are returned to the player in the frontend.  

4. **Player Explores Sampled Songs**:  
   - The player can now explore the tracks and identify the original songs sampled in popular tracks.

## Future Improvements  
- Add a **leaderboard** to track top players  
- Implement **user authentication** for personalized game history  
- Enhance **mobile responsiveness** for better UX  
