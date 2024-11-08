// search.js

const songsList = document.getElementById("songsList");
const searchBar = document.getElementById("searchBar");
let debounceTimeout;

const correctSongElement = document.getElementById("correctSong");
const correctSong = {
  name: correctSongElement.getAttribute("data-name"),
  artist: correctSongElement.getAttribute("data-artist"),
};

const sampledSongElement = document.getElementById("sampledSong");
const sampledSong = {
  name: sampledSongElement.getAttribute("data-name"),
  artist: sampledSongElement.getAttribute("data-artist"),
};

let incorrectCount = 0;

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
  songsList.innerHTML = songs
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
    .join("");

  // Add event listeners to each song-item after rendering
  const songItems = document.querySelectorAll(".song-item");
  songItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const song = songs[index];
      songPress(song.name, song.artists[0].name, song.album.images[0]?.url);
    });
  });
}


function songPress(selectedSongName, selectedArtistName, thumbnail) {
  stopAudio();

  // Helper function to sanitize strings: remove all non-letter characters
  function normalizeString(str) {
    return str
      .toLowerCase()
      .replace(/[^a-zåäöéèëüöçñáàâêîôûÿæœ]+/gi, ""); // Keep letters and common special characters
  }

  // Sanitize and normalize shortened song names and artist names for comparison only
  const normalizedSelectedName = normalizeString(selectedSongName.slice(0, 4));
  const normalizedCorrectName = normalizeString(correctSong.name.slice(0, 4));
  const normalizedSelectedArtist = normalizeString(selectedArtistName.slice(0, 4));
  const normalizedCorrectArtist = normalizeString(correctSong.artist.slice(0, 4));

  console.log("Normalized Selected Name:", normalizedSelectedName);
  console.log("Normalized Correct Name:", normalizedCorrectName);
  console.log("Normalized Selected Artist:", normalizedSelectedArtist);
  console.log("Normalized Correct Artist:", normalizedCorrectArtist);

  // Perform the isCorrect comparison with shortened strings
  const isCorrect =
    normalizedSelectedName === normalizedCorrectName &&
    normalizedSelectedArtist === normalizedCorrectArtist;

  const songGuess = {
    name: selectedSongName, // Keep the full name
    artist: selectedArtistName, // Keep the full artist name
    thumbnail: thumbnail,
    correct: isCorrect,
  };

  guessedSongs.push(songGuess);

  searchBar.value = ""; 
  songsList.innerHTML = ""; 

  songCorrect(songGuess);
}





function songCorrect(guess) {
    const healthItems = document.querySelectorAll(".healthbar .health-item");
    const index = guessedSongs.length - 1;
  
    if (index >= 0 && index < healthItems.length) {
      const item = healthItems[index];
      if (guess.correct) {
        isFinalAnswer = true;
        item.classList.add("correct");
        document.getElementById("searchBar").style.display = "none";
        document.getElementById("skipButtonWrapper").style.display = "none";
        const healthMeter = document.querySelector(".healthMeter");
        healthMeter.style.backgroundColor = "#321b27";
        healthMeter.style.padding = "1rem";
        healthMeter.style.marginTop = "2rem";
        if (window.matchMedia("(max-width: 400px)").matches) {
          healthMeter.style.height = "10rem"; // Set height to 10rem for small screens
        } else {
          healthMeter.style.height = "8rem"; // Reset height to default for larger screens
        }
  
        const successMessage = document.createElement("p");
        successMessage.innerText = "You correctly scrambled the sample!";
        successMessage.style.color = "#f5f5f5";
        successMessage.style.textAlign = "center";
        successMessage.style.fontSize = "1.2rem";
        successMessage.style.marginBottom = "1rem";
        healthMeter.insertBefore(successMessage, healthMeter.firstChild);
  
        
  
        window.songLength = 27000;
  
        for (let i = guessedSongs.length; i < 3; i++) {
          const healthItem = healthItems[i];
          healthItem.classList.add("color");
        }
        displayCorrectSong();
        setTimeout(displayGuessedSongs, 50);
      } else {
        item.classList.add("incorrect");
        window.songLength *= 3;
        incorrectCount += 1;
  
        // Display hints based on incorrect count
        displayHint(incorrectCount);
  
        if (incorrectCount === 3) {
          isFinalAnswer = true;
          document.getElementById("searchBar").style.display = "none";
          document.getElementById("skipButtonWrapper").style.display = "none";
          const healthMeter = document.querySelector(".healthMeter");
          healthMeter.style.backgroundColor = "#321b27";
          healthMeter.style.padding = "1rem";
          healthMeter.style.marginTop = "2rem";
          if (window.matchMedia("(max-width: 400px)").matches) {
            healthMeter.style.height = "10rem"; // Set height to 10rem for small screens
          } else {
            healthMeter.style.height = "8rem"; // Reset height to default for larger screens
          }
  
          const failureMessage = document.createElement("p");
          failureMessage.innerText = "You could not scramble the sample!";
          failureMessage.style.color = "#f5f5f5";
          failureMessage.style.textAlign = "center";
          failureMessage.style.fontSize = "1.2rem";
          failureMessage.style.marginBottom = "1rem";
          healthMeter.insertBefore(failureMessage, healthMeter.firstChild);
  
          displayCorrectSong();
          setTimeout(displayGuessedSongs, 50);
        }
      }
    }
  }
  
  function skipRound() {
    stopAudio();
    const healthItems = document.querySelectorAll(".healthbar .health-item");
    const index = guessedSongs.length;
  
    if (index < healthItems.length) {
      const item = healthItems[index];
      item.classList.add("incorrect");
      window.songLength *= 3;
      incorrectCount += 1;
  
      // Display hints based on incorrect count
      displayHint(incorrectCount);
  
      // Show hints and skip button if guesses are hidden
      if (hintsContainer) hintsContainer.style.display = "block";
      skipButtonWrapper.style.display = "block";
  
      if (incorrectCount === 3) {
        isFinalAnswer = true;
        document.getElementById("searchBar").style.display = "none";
        skipButtonWrapper.style.display = "none";
        const healthMeter = document.querySelector(".healthMeter");
        healthMeter.style.backgroundColor = "#321b27";
        healthMeter.style.padding = "1rem";
        healthMeter.style.marginTop = "2rem";
        if (window.matchMedia("(max-width: 400px)").matches) {
            healthMeter.style.height = "10rem"; // Set height to 10rem for small screens
          } else {
            healthMeter.style.height = "8rem"; // Reset height to default for larger screens
          }
  
        const failureMessage = document.createElement("p");
        failureMessage.innerText = "You could not scramble the sample!";
        failureMessage.style.color = "#f5f5f5";
        failureMessage.style.textAlign = "center";
        failureMessage.style.fontSize = "1.2rem";
        failureMessage.style.marginBottom = "1rem";
        healthMeter.insertBefore(failureMessage, healthMeter.firstChild);
  
        displayCorrectSong();
        setTimeout(displayGuessedSongs, 10);
      }
  
      guessedSongs.push({ name: "Skipped", correct: false });
    }
  }
  
  

// Debounce function to limit API calls
function debounce(func, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
}

// Elements to hide/show
const hintsContainer = document.getElementById("hintContainer");
const skipButtonWrapper = document.getElementById("skipButtonWrapper");

// Event listener for the search bar
searchBar.addEventListener("input", (e) => {
  const query = e.target.value;

  if (query.length >= 4) {
    debounce(() => searchTracks(query), 300); // Debounce API calls by 300ms
    // Hide hints and skip button while searching
    if (hintsContainer) hintsContainer.style.display = "none";
    skipButtonWrapper.style.display = "none";
  } else {
    songsList.innerHTML = ""; // Clear results if the search bar is empty
    // Show hints and skip button again if search is cleared
    if (hintsContainer) hintsContainer.style.display = "block";
    skipButtonWrapper.style.display = "block";
  }
});


// Add an event listener for clicks on the document
document.addEventListener("click", (event) => {
  if (isFinalAnswer) return;
  // Check if the click was outside the search bar and songs list
  const isClickInsideSearchBar = searchBar.contains(event.target);
  const isClickInsideSongsList = songsList.contains(event.target);

  if (!isClickInsideSearchBar && !isClickInsideSongsList) {
    searchBar.value = ""; // Clear the input value
    songsList.innerHTML = ""; // Clear the displayed song list
    if (hintsContainer) hintsContainer.style.display = "block";
    skipButtonWrapper.style.display = "block";
  }
});


function displayHint(incorrectCount) {
    const hintsElement = document.getElementById("hints");
    const skipButtonWrapper = document.getElementById("skipButtonWrapper");
  
    // Create the hint container if it doesn't already exist
    let hintContainer = document.getElementById("hintContainer");
    if (!hintContainer) {
      hintContainer = document.createElement("div");
      hintContainer.id = "hintContainer";
      hintContainer.style.color = "#f5f5f5";
      hintContainer.style.textAlign = "center";
      hintContainer.style.fontSize = "1.2rem";
      hintContainer.style.marginTop = "1rem";
      skipButtonWrapper.appendChild(hintContainer);
  
      // Add the "Hints:" heading
      const hintsHeading = document.createElement("p");
      hintsHeading.innerText = "Hints:";
      hintsHeading.style.color = "#9CA3AF"; // Soft gray color
      hintsHeading.style.fontWeight = "bold";
      hintsHeading.style.marginBottom = "0.5rem";
      hintContainer.appendChild(hintsHeading);
    }
  
    // Append hints based on the incorrect count
    if (incorrectCount === 1) {
      // Display release date on first incorrect guess
      const releaseDateHint = document.createElement("p");
      releaseDateHint.innerText = `Released ${hintsElement.getAttribute("data-date")}`;
      hintContainer.appendChild(releaseDateHint);
    } else if (incorrectCount === 2) {
      // Display artist on second incorrect guess
      const artistHint = document.createElement("p");
      artistHint.innerText = `${hintsElement.getAttribute("data-artist")}`;
      hintContainer.appendChild(artistHint);
    }
  }
  
  



  async function displayCorrectSong() {
    const findCorrectSongName = correctSong.name;
    const findCorrectSongArtist = correctSong.artist;
  
    try {
      // Search by both song name and artist
      const query = `${findCorrectSongName} ${findCorrectSongArtist}`;
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
  
      // Display only the first matching song
      if (data.length > 0) {
        const song = data[0];
        const rightSongElement = document.getElementById("rightSong");
  
        // Add a heading with the text "The correct song was:"
        rightSongElement.innerHTML = `
                  <h2 style="text-align: center; color: #f5f5f5; font-size: 1.2rem; margin: 1rem 0 0 0;">
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
  
    const findSampledSongName = sampledSong.name;
    const findSampledSongArtist = sampledSong.artist;
  
    try {
      // Search by both sampled song name and artist
      const querySampled = `${findSampledSongName} ${findSampledSongArtist}`;
      const response = await fetch(`/api/search?q=${encodeURIComponent(querySampled)}`);
      const data = await response.json();
  
      // Display only the first matching song for the sampled song
      if (data.length > 0) {
        const song = data[0];
        const borrowedSongElement = document.getElementById("borrowedSong");
  
        // Add a heading with the text "Here’s the song that was sampled:"
        borrowedSongElement.innerHTML = `
                  <h2 style="text-align: center; color: #f5f5f5; font-size: 1.2rem; margin: 0;">
                      Here’s the song that was sampled:
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
      console.error("Error fetching the sampled song:", error);
    }
  }
  