// Get audio element and controls
const audio = document.getElementById("myAudio");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const progressBar = document.getElementById("progressBar");

// Control variables
let timeoutId;
let progressInterval;
window.songLength = 3000; // 3 seconds

// Function to handle play/pause toggle
function playPauseAudio() {
  if (audio.paused) {
    startAudio();
  } else {
    stopAudio();
  }
}

let startTime;

function startAudio() {
  audio.play();
  toggleIcons(false); // Show pause icon, hide play icon
  startTime = Date.now(); // Record the start time

  // Update progress every 100ms
  progressInterval = setInterval(updateProgress, 100);

  // Set a timeout to stop audio after songLength time
  timeoutId = setTimeout(stopAudio, songLength);
}

function stopAudio() {
  audio.load(); // Reload audio instead of pause to reset whole song
  toggleIcons(true); // Show play, hide pause icon
  progressBar.style.width = "0%"; // Reset progress bar

  // Clear active intervals and timeouts
  clearInterval(progressInterval);
  clearTimeout(timeoutId);
}

function updateProgress() {
  const elapsedTime = Date.now() - startTime; // Calculate elapsed time
  const progressPercent = (elapsedTime / songLength) * 107;
  progressBar.style.width = Math.min(progressPercent, 107) + "%"; // Cap at 107% if over
}





// Toggle icons between play and pause states
function toggleIcons(showPlay) {
  playIcon.style.display = showPlay ? "inline" : "none";
  pauseIcon.style.display = showPlay ? "none" : "inline";
}
