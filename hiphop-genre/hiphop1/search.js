const songsList = document.getElementById('songsList');
const searchBar = document.getElementById('searchBar');
let debounceTimeout;

async function searchTracks(query) {
    const searchUrl = `http://localhost:3000/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        displaySongs(data);
    } catch (error) {
        console.error("Error fetching tracks:", error);
    }
}

function displaySongs(songs) {
    const htmlString = songs
        .map((song) => `
            <li class="song-item">
                <div class="song-thumbnail">
                    <img src="${song.album.images[0]?.url}" alt="${song.name} cover" />
                </div>
                <div class="song-info">
                    <h2 class="song-title">${song.name}</h2>
                    <p class="song-artist">${song.artists[0].name}</p>
                </div>
            </li>
        `)
        .join('');
    songsList.innerHTML = htmlString;
}

// Debounce function to limit API calls
function debounce(func, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
}

searchBar.addEventListener('keyup', (e) => {
    const query = e.target.value;
    if (query.length >= 4) {
        debounce(() => searchTracks(query), 300);
    } else {
        songsList.innerHTML = "";
    }
});

searchBar.addEventListener('blur', () => {
    searchBar.value = '';
    songsList.innerHTML = '';
});
