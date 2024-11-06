// display.js

// Function to display the guessed songs list
function displayGuessedSongs() {
    const guessedSongsContainer = document.getElementById('guessedSongsList');
    const guessedSongsWrapper = document.getElementById('guessedSongsWrapper');

    // Check if guessedSongs has any items; if not, don't display
    if (guessedSongs.length === 0) {
        guessedSongsWrapper.style.display = 'none';
        return;
    }

    // Populate the guessed songs list
    guessedSongsContainer.innerHTML = guessedSongs
        .map(guess => `
            <li class="song-item">
                <div class="song-thumbnail">
                    <img src="${guess.thumbnail}" alt="${guess.name} cover" />
                </div>
                <div class="song-info">
                    <h2 class="song-title">${guess.name}</h2>
                    <p class="song-artist">${guess.artist}</p>
                </div>
            </li>
        `).join('');

    // Display the guessed songs wrapper
    guessedSongsWrapper.style.display = 'block';
}

// Function to hide the guessed songs list
function hideGuessedSongs(event) {
    // Prevent hiding if the correct answer has been guessed
    if (isFinalAnswer) return;

    const guessedSongsWrapper = document.getElementById('guessedSongsWrapper');

    // Check if the click occurred outside of the guessed songs wrapper
    if (!guessedSongsWrapper.contains(event.target) && !event.target.closest('.health-item a')) {
        guessedSongsWrapper.style.display = 'none';
    }
}


// Attach event listener to each health item link
document.querySelectorAll('.health-item a').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent any default action
        displayGuessedSongs();
    });
});

// Attach an event listener to the document to hide the guessed songs list when clicking outside
document.addEventListener('click', hideGuessedSongs);

