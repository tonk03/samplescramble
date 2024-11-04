// Get audio element and controls
const audio = document.getElementById("myAudio");
const playIcon = document.getElementById("playIcon");
const pauseIcond = document.getElementById("pauseIcon");
const progressBar = document.getElementById("progressBar");

// Control variables
let timeoutId;
let progressInterval;
let songLength = 10000; // 10 seconds

// Function to handle play/pause toggle
function playPauseAudio() {
  if (audio.paused) {
    startAudio();
  } else {
    stopAudio();
  }
}

// Start playing audio and initialize progress update
function startAudio() {
  audio.play();
  toggleIcons(false); // Show pause icon, hide play icon

  // Update progress at regular intervals
  progressInterval = setInterval(updateProgress, 50);

  // Set a timeout to stop audio after songLength time
  timeoutId = setTimeout(stopAudio, songLength);
}

// Stop audio and reset progress
function stopAudio() {
  audio.load(); // Reload audio instead of pause to reset whole song
  toggleIcons(true); // Show play, hide pause icon
  progressBar.style.width = "0%"; // Reset progress bar

  // Clear active intervals and timeouts
  clearInterval(progressInterval); // Stop updating progress when audio stops
  clearTimeout(timeoutId);
}

// Toggle icons between play and pause states
function toggleIcons(showPlay) {
  playIcon.style.display = showPlay ? "inline" : "none";
  pauseIcon.style.display = showPlay ? "none" : "inline";
}

function updateProgress() {
  const progressPercent = (audio.currentTime / (songLength / 1000)) * 100;
  progressBar.style.width = progressPercent + "%";
}
