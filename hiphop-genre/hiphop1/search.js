const clientID = "988297459f8242d2a991119fb9a29d66";
const clientSecret = "9fb2d703976545d681616ee6fe7257ae";

const songsList = document.getElementById('songsList');
const searchBar = document.getElementById('searchBar');
let debounceTimeout;

// Encode credentials in Base64
const credentials = btoa(`${clientID}:${clientSecret}`);

// Request options for getting the access token
const tokenUrl = 'https://accounts.spotify.com/api/token';
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
    },
    body: 'grant_type=client_credentials'
};

// Function to get the access token
async function getAccessToken() {
    try {
        const response = await fetch(tokenUrl, requestOptions);
        const data = await response.json();
        
        if (response.ok) {
            return data.access_token;
        } else {
            console.error("Failed to retrieve access token:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to search tracks based on query
async function searchTracks(query) {
    const token = await getAccessToken();
    const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`;

    const searchOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(searchUrl, searchOptions);
    const data = await response.json();
    displaySongs(data.tracks.items);
}

// Display songs in the HTML
function displaySongs(songs) {
    const htmlString = songs
        .map((song) => {
            return `
            <li class="song-item">
                <div class="song-thumbnail">
                    <img src="${song.album.images[0]?.url}" alt="${song.name} cover" />
                </div>
                <div class="song-info">
                    <h2 class="song-title">${song.name}</h2>
                    <p class="song-artist">${song.artists[0].name}</p>
                </div>
            </li>
            `;
        })
        .join('');
    songsList.innerHTML = htmlString;
}


// Debounce function to limit API calls
function debounce(func, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
}

// Event listener for the search bar
searchBar.addEventListener('keyup', (e) => {
    const query = e.target.value;
    
    if (query.length >= 4) {
        debounce(() => searchTracks(query), 300); // Debounce API calls by 300ms
    } else {
        songsList.innerHTML = ""; // Clear results if the search bar is empty
    }
});

// Clear the search bar when clicking outside of it
searchBar.addEventListener('blur', () => {
    searchBar.value = '';         // Clear the input value
    songsList.innerHTML = '';      // Clear the displayed song list
});