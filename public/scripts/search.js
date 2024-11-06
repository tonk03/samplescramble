// search.js

const songsList = document.getElementById('songsList');
const searchBar = document.getElementById('searchBar');
let debounceTimeout;

const correctSongElement = document.getElementById('correctSong');
    const correctSong = {
        name: correctSongElement.getAttribute('data-name'),
        artist: correctSongElement.getAttribute('data-artist')
    };

const guessedSongs = []; // Array to store each songGuess after songPress is called



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
            <li onclick="songPress('${song.name}', '${song.artists[0].name}', '${song.album.images[0]?.url}')" class="song-item">
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


function songPress(selectedSongName, selectedArtistName, thumbnail) {
    const isCorrect = selectedSongName === correctSong.name && selectedArtistName === correctSong.artist;
    
    const songGuess = {
        name: selectedSongName,
        artist: selectedArtistName,
        thumbnail: thumbnail,
        correct: isCorrect
    };

    // Add songGuess to guessedSongs array
    guessedSongs.push(songGuess);

    console.log("Guessed Songs:", guessedSongs); // Log the updated array to check its contents

    // Clear the search bar and song list
    searchBar.value = '';          // Clear the input value
    songsList.innerHTML = '';      // Clear the displayed song list
    
    songCorrect(songGuess);
}


function songCorrect(guess) {
    const healthItems = document.querySelectorAll('.healthbar .health-item');
    const index = guessedSongs.length - 1;

    if (index >= 0 && index < healthItems.length) {
        const item = healthItems[index];
        if (guess.correct) {
            item.classList.add('correct');
            document.getElementById('searchBar').style.display = 'none';
            const healthMeter = document.querySelector('.healthMeter');
            healthMeter.style.backgroundColor = '#321b27';
            healthMeter.style.height ='8rem'
            healthMeter.style.padding = '1rem'

            const successMessage = document.createElement('p');
            successMessage.innerText = 'You correctly scrambled the sample!';
            successMessage.style.color = '#f5f5f5';
            successMessage.style.textAlign = 'center';
            successMessage.style.fontSize = '1.2rem';
            successMessage.style.marginBottom = '1rem';
            healthMeter.insertBefore(successMessage, healthMeter.firstChild);

            window.songLength = 27000; // Update the global songLength on correct guess
        } else {
            item.classList.add('incorrect');
            window.songLength *= 3; // Update the global songLength on incorrect guess
            console.log("New songLength (incorrect guess):", window.songLength);
        }
    }
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

// Add an event listener for clicks on the document
document.addEventListener('click', (event) => {
    // Check if the click was outside the search bar and songs list
    const isClickInsideSearchBar = searchBar.contains(event.target);
    const isClickInsideSongsList = songsList.contains(event.target);
    
    if (!isClickInsideSearchBar && !isClickInsideSongsList) {
        searchBar.value = '';         // Clear the input value
        songsList.innerHTML = '';      // Clear the displayed song list
    }
});
