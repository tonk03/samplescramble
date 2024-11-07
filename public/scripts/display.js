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
    
    // Hide hints and skip button when displaying guessed songs
    if(hintsContainer) hintsContainer.style.display = "none";
    skipButtonWrapper.style.display = "none"; // Ensure skipButtonWrapper is hidden

    
    console.log("Guessed Songs Wrapper Style Before:", guessedSongsWrapper.style.display);
    console.log("Guessed Songs Wrapper Content:", guessedSongsContainer.innerHTML);
    console.log("Is Skip Button Hidden?", skipButtonWrapper.style.display === "none");
    // Check if guessedSongs has any items; if not, don't display
    

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

