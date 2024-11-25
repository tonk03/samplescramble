// display.js

function displayGuessedSongs() {
    const guessedSongsContainer = document.getElementById('guessedSongsList');
    const guessedSongsWrapper = document.getElementById('guessedSongsWrapper');
    const hintsContainer = document.getElementById("hintContainer");
    const skipButtonWrapper = document.getElementById("skipButtonWrapper");

    if (guessedSongs.length === 0) {
        guessedSongsWrapper.style.display = 'none';
        return;
    }

    if (hintsContainer) hintsContainer.style.display = "none";
    skipButtonWrapper.style.display = "none";

    guessedSongsContainer.innerHTML = guessedSongs
        .map(guess => `
            <li class="song-item" ${guess.name !== "Skipped" ? `data-url="${guess.url}"` : ''}>
                <div class="song-thumbnail">
                    <img src="${guess.thumbnail || ''}" alt="${guess.name} cover" />
                </div>
                <div class="song-info">
                    <h2 class="song-title">${guess.name}</h2>
                    <p class="song-artist">${guess.artist || 'Skipped Artist'}</p>
                </div>
            </li>
        `).join('');

    guessedSongsWrapper.style.display = 'block';

    // Add click event listeners to non-skipped songs
    const songItems = document.querySelectorAll('.song-item[data-url]');
    songItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const url = item.getAttribute('data-url');
            console.log(`Navigating to: ${url}`); // Console log to confirm URL
            window.open(url, '_blank'); // Open the link in a new tab
        });
    });
}



// Function to hide the guessed songs list
function hideGuessedSongs(event) {
    // Prevent hiding if the correct answer has been guessed
    if (isFinalAnswer) return;

    const hintsContainer = document.getElementById("hintContainer");
    const skipButtonWrapper = document.getElementById("skipButtonWrapper");

    const guessedSongsWrapper = document.getElementById('guessedSongsWrapper');

    if (guessedSongsWrapper && guessedSongsWrapper.style.display === 'none') {
        return;
    }
    // Check if the click occurred outside of the guessed songs wrapper
    if (!guessedSongsWrapper.contains(event.target) && !event.target.closest('.health-item a')) {
        guessedSongsWrapper.style.display = 'none';
        hintsContainer.style.display = "block";
        skipButtonWrapper.style.display = "block";
    
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

