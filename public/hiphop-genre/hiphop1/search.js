// search.js

const songsList = document.getElementById('songsList');
const searchBar = document.getElementById('searchBar');
let debounceTimeout;

// Function to search tracks by querying the backend
async function searchTracks(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displaySongs(data); // Pass data directly from backend response
    } catch (error) {
        console.error("Error performing search:", error);
    }
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
