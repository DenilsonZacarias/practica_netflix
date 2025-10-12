const video = document.getElementById("video");
const clickOverlay = document.getElementById("click-overlay");
const togglePlayBtn = document.getElementById("toggle-play");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const brightnessSlider = document.getElementById("brightness");

const controlsCenter = document.querySelector(".controls-center");
const bottomControls = document.getElementById("bottom-controls");
const controlsBrightness = document.querySelector(".controls-brightness");

const btnAdvance = document.getElementById("advance-seconds");
const btnReverse = document.getElementById("reverse-seconds");

//Tentativas de ter os botoes depois de play
document.addEventListener("mousemove", showControlsTemporarily);
document.addEventListener("touchstart", showControlsTemporarily);

let controlsTimeout = null;

// Atualiza os ícones e visibilidade dos controlos
function updateIcons() {
  const isPlaying = !video.paused && !video.ended;

  if (isPlaying) {
    iconPlay.classList.add("hidden");
    iconPause.classList.remove("hidden");
  } else {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
  }
}

// Mostrar controles
function showControlsTemporarily() {
  controlsCenter.classList.remove("hidden");
  controlsBrightness.classList.remove("hidden");
  bottomControls.classList.remove("hidden");

  // Limpar timeout anterior
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    if (!video.paused) {
      controlsCenter.classList.add("hidden");
      controlsBrightness.classList.add("hidden");
      bottomControls.classList.add("hidden");
    }
  }, 3000); // 3 segundos
}

// Toggle play/pause
togglePlayBtn.addEventListener("click", () => {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
});

// Avançar 10 segundos
btnAdvance.addEventListener("click", () => {
  video.currentTime = Math.min(video.duration, video.currentTime + 10);
});

// Recuar 10 segundos
btnReverse.addEventListener("click", () => {
  video.currentTime = Math.max(0, video.currentTime - 10);
});

// Atualiza os ícones e controla visibilidade
video.addEventListener("play", () => {
  updateIcons();
  showControlsTemporarily();
});

video.addEventListener("pause", () => {
  updateIcons();
  // Mostrar controles quando em pausa
  controlsCenter.classList.remove("hidden");
  controlsBrightness.classList.remove("hidden");
  bottomControls.classList.remove("hidden");
});

// Clicar no vídeo mostra os controles
video.addEventListener("click", () => {
  showControlsTemporarily(); // Mostrar os controles sempre
});

//Click overlay
clickOverlay.addEventListener("click", () => {
  showControlsTemporarily();
});

// Atualiza a duração total
video.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(video.duration);
  progress.max = Math.floor(video.duration);
});

// Atualiza o progresso
video.addEventListener("timeupdate", () => {
  progress.value = Math.floor(video.currentTime);
  currentTimeEl.textContent = formatTime(video.currentTime);
});

// Permitir mover pelo slider
progress.addEventListener("input", () => {
  video.currentTime = progress.value;
});

// Simular brilho com CSS filter
brightnessSlider.addEventListener("input", () => {
  const brightness = brightnessSlider.value;
  video.style.filter = `brightness(${brightness}%)`;
});

// Formatador de tempo
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

// Ocultar controles nativos
video.controls = false;

// Atualizar estado no load
document.addEventListener("DOMContentLoaded", () => {
  updateIcons();
  showControlsTemporarily();
});
