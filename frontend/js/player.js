import { formatTemp } from "./utils/formatTemp.js";
import { mountMusicsList } from './mountMusicsList.js'

const audioPlayer = document.getElementById("audioPlayer");
const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("currentTimeAndDuration");
const volumeSlider = document.getElementById("volume");
mountMusicsList();

/**
 ** @EventListeners {Player}
 */
volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value;
});

audioPlayer.addEventListener("error", (event) => {
  console.error("Erro na reprodução de áudio:", event);
});

audioPlayer.addEventListener("timeupdate", (event) => {
  const currentTimeValue = formatTemp(event.target.currentTime || 0);
  const durationValue = formatTemp(event.target.duration || 0);
  currentTime.innerText = `${currentTimeValue}/${durationValue}`;

  const progressPercent = (event.target.currentTime / event.target.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
});
