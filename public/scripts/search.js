// search.js

const songsList = document.getElementById("songsList");
const searchBar = document.getElementById("searchBar");
let debounceTimeout;

const correctSongElement = document.getElementById("correctSong");
const correctSong = {
  name: correctSongElement.getAttribute("data-name"),
  artist: correctSongElement.getAttribute("data-artist"),
};

const guessedSongs = []; // Array to store each songGuess after songPress is called
let isFinalAnswer = false; // Flag to prevent hiding guessed songs after correct answer

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
    .join("");
  songsList.innerHTML = htmlString;
}

function songPress(selectedSongName, selectedArtistName, thumbnail) {
  const isCorrect =
    selectedSongName === correctSong.name &&
    selectedArtistName === correctSong.artist;

  const songGuess = {
    name: selectedSongName,
    artist: selectedArtistName,
    thumbnail: thumbnail,
    correct: isCorrect,
  };

  // Add songGuess to guessedSongs array
  guessedSongs.push(songGuess);

  // Clear the search bar and song list
  searchBar.value = ""; // Clear the input value
  songsList.innerHTML = ""; // Clear the displayed song list

  songCorrect(songGuess);
}

function songCorrect(guess) {
  const healthItems = document.querySelectorAll(".healthbar .health-item");
  const index = guessedSongs.length - 1;

  if (index >= 0 && index < healthItems.length) {
    const item = healthItems[index];
    if (guess.correct) {
      isFinalAnswer = true; // Set flag when correct answer is guessed
      item.classList.add("correct");
      document.getElementById("searchBar").style.display = "none";
      const healthMeter = document.querySelector(".healthMeter");
      healthMeter.style.backgroundColor = "#321b27";
      healthMeter.style.height = "8rem";
      healthMeter.style.padding = "1rem";
      healthMeter.style.marginTop = "2rem";

      const successMessage = document.createElement("p");
      successMessage.innerText = "You correctly scrambled the sample!";
      successMessage.style.color = "#f5f5f5";
      successMessage.style.textAlign = "center";
      successMessage.style.fontSize = "1.2rem";
      successMessage.style.marginBottom = "1rem";
      healthMeter.insertBefore(successMessage, healthMeter.firstChild);

      displayCorrectSong();

      window.songLength = 27000; // Update the global songLength on correct guess

      for (let i = guessedSongs.length; i < 3; i++) {
        const healthItem = healthItems[i];
        healthItem.classList.add("color");
      }

      setTimeout(displayGuessedSongs, 10); // Delay to ensure DOM changes complete
    } else {
      item.classList.add("incorrect");
      window.songLength *= 3; // Update the global songLength on incorrect guess

      if (guessedSongs.length === 3) {
        isFinalAnswer = true; // Set flag when correct answer is guessed
        document.getElementById("searchBar").style.display = "none";
        const healthMeter = document.querySelector(".healthMeter");
        healthMeter.style.backgroundColor = "#321b27";
        healthMeter.style.height = "8rem";
        healthMeter.style.padding = "1rem";
        healthMeter.style.marginTop = "2rem";

        const successMessage = document.createElement("p");
        successMessage.innerText = "You could not scramble the sample!";
        successMessage.style.color = "#f5f5f5";
        successMessage.style.textAlign = "center";
        successMessage.style.fontSize = "1.2rem";
        successMessage.style.marginBottom = "1rem";
        healthMeter.insertBefore(successMessage, healthMeter.firstChild);

        displayCorrectSong();
        setTimeout(displayGuessedSongs, 10); // Delay to ensure DOM changes complete
      }
    }
  }
}

// Debounce function to limit API calls
function debounce(func, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
}

// Event listener for the search bar
searchBar.addEventListener("keyup", (e) => {
  const query = e.target.value;

  if (query.length >= 4) {
    debounce(() => searchTracks(query), 300); // Debounce API calls by 300ms
  } else {
    songsList.innerHTML = ""; // Clear results if the search bar is empty
  }
});

// Add an event listener for clicks on the document
document.addEventListener("click", (event) => {
  // Check if the click was outside the search bar and songs list
  const isClickInsideSearchBar = searchBar.contains(event.target);
  const isClickInsideSongsList = songsList.contains(event.target);

  if (!isClickInsideSearchBar && !isClickInsideSongsList) {
    searchBar.value = ""; // Clear the input value
    songsList.innerHTML = ""; // Clear the displayed song list
  }
});

async function displayCorrectSong() {
  const query = correctSong.name; // Use the correct song's name as the query
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    // Display only the first matching song
    if (data.length > 0) {
      const song = data[0];
      const rightSongElement = document.getElementById("rightSong");

      // Add a heading with the text "The correct song was:"
      rightSongElement.innerHTML = `
                <h2 style="text-align: center; color: #f5f5f5; font-size: 1.2rem; margin: 1rem 0 0 0; ">
                    The correct song was:
                </h2>
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
    }
  } catch (error) {
    console.error("Error fetching the correct song:", error);
  }
}
