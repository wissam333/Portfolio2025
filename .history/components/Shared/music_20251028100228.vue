<template>
  <div class="music-box" data-aos="fade-left" data-aos-delay="1200">
    <div class="music-inner">
      <!-- Header -->
      <div class="header">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 3v10.55A4 4 0 1014 17V7h4V3z" />
        </svg>
        <span class="title">{{
          $i18n.locale === "ar" ? "التشغيل الآن" : "Now Playing"
        }}</span>
      </div>

      <!-- Song Info -->
      <div class="song-info">
        <span class="name">{{ songName }}</span>
        <button
          name="play-btn"
          class="play-btn"
          @click="handlePlayClick"
          :disabled="isLoading"
        >
          <!-- Loading State -->
          <svg
            v-if="isLoading"
            class="btn-icon loading-spinner"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
              opacity="0.25"
            />
            <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          <!-- Play Icon -->
          <svg
            v-else-if="!isPlaying && !isLoading"
            class="btn-icon"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>

          <!-- Pause Icon -->
          <svg v-else class="btn-icon" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6zm8-14v14h4V5z" />
          </svg>
        </button>
      </div>

      <!-- Progress -->
      <div class="progress" v-if="!isLoading">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- Loading Progress -->
      <div class="progress loading-progress" v-else>
        <div class="bar loading-bar"></div>
      </div>
    </div>

    <!-- Snowy glow -->
    <div class="snow-glow"></div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";

const props = defineProps({
  position: { type: String, default: "bottom-right" },
});

// Song data
const songUrl = "/savior.mp3";
const songName = "Savior";

// Reactive state
const audio = ref(null);
const isPlaying = ref(false);
const isLoading = ref(false);
const progress = ref(0);
const hasLoaded = ref(false);

const handlePlayClick = async () => {
  // If already loading, do nothing
  if (isLoading.value) return;

  // If audio hasn't been loaded yet
  if (!hasLoaded.value) {
    await loadAudio();
  }

  // Toggle play/pause after loading
  if (hasLoaded.value) {
    togglePlay();
  }
};

const loadAudio = () => {
  return new Promise((resolve) => {
    isLoading.value = true;

    // Create audio element only when needed
    audio.value = new Audio(songUrl);

    // Set up event listeners
    audio.value.addEventListener("loadeddata", () => {
      console.log("Audio loaded successfully");
      hasLoaded.value = true;
      isLoading.value = false;
      resolve();
    });

    audio.value.addEventListener("canplaythrough", () => {
      console.log("Audio can play through");
      hasLoaded.value = true;
      isLoading.value = false;
      resolve();
    });

    audio.value.addEventListener("error", (e) => {
      console.error("Error loading audio:", e);
      isLoading.value = false;
      // You could show an error state here
      resolve();
    });

    audio.value.addEventListener("loadstart", () => {
      console.log("Starting to load audio...");
    });

    audio.value.addEventListener("progress", (e) => {
      // Optional: show loading progress
      if (audio.value.duration > 0) {
        const buffered = audio.value.buffered;
        if (buffered.length > 0) {
          const loaded =
            (buffered.end(buffered.length - 1) / audio.value.duration) * 100;
          console.log(`Loaded: ${loaded.toFixed(1)}%`);
        }
      }
    });

    // Preload metadata only (not the entire file)
    audio.value.preload = "metadata";

    // Start loading
    audio.value.load();
  });
};

const togglePlay = () => {
  if (!audio.value || !hasLoaded.value) return;

  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play().catch((error) => {
      console.error("Playback failed:", error);
      // Handle autoplay restrictions
    });
  }
  isPlaying.value = !isPlaying.value;
};

const updateProgress = () => {
  if (!audio.value || !audio.value.duration) return;
  progress.value = (audio.value.currentTime / audio.value.duration) * 100;
};

// Set up event listeners after audio is loaded
const setupAudioListeners = () => {
  if (!audio.value) return;

  audio.value.addEventListener("timeupdate", updateProgress);
  audio.value.addEventListener("ended", () => {
    isPlaying.value = false;
    progress.value = 0;
  });

  audio.value.addEventListener("pause", () => {
    isPlaying.value = false;
  });

  audio.value.addEventListener("play", () => {
    isPlaying.value = true;
  });
};

// Watch for when audio is loaded to set up listeners
watch(hasLoaded, (loaded) => {
  if (loaded) {
    setupAudioListeners();
  }
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.removeEventListener("timeupdate", updateProgress);
    audio.value.removeEventListener("ended", () => {});
    audio.value = null;
  }
});
</script>

<style lang="scss" scoped>
.music-box {
  position: fixed;
  z-index: 999;
  pointer-events: none;
  bottom: 20px;
  inset-inline-end: 20px;
  @media (max-width: 991px) {
    bottom: 10px;
    inset-inline-end: 10px;
  }
}

.music-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
  min-width: 220px;
  backdrop-filter: blur(8px);
  background: rgba(160, 190, 255, 0.15);
  border: 1px solid rgba(200, 220, 255, 0.2);
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.21),
    0 0 25px rgba(140, 180, 255, 0.045);
  color: #e6f0ff;
  @media (max-width: 991px) {
    min-width: 160px;
  }
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 991px) {
    display: none;
  }
}
.icon {
  width: 18px;
  height: 18px;
  fill: #cfe6ff;
}
.title {
  font-size: 13px;
  font-weight: 600;
}

/* Song info */
.song-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 0 8px rgba(120, 170, 255, 0.6);
}
.play-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  transition: background 0.3s;
  @media (max-width: 991px) {
    padding: 0px;
    width: 25px;
    height: 25px;
  }
}
.play-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.btn-icon {
  width: 20px;
  height: 20px;
  fill: #fff;
  @media (max-width: 991px) {
    width: 15px;
    height: 15px;
  }
}

/* Progress */
.progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
  @media (max-width: 991px) {
    height: 3px;
  }
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, #9fd1ff, #6ba7ff);
  border-radius: 6px;
  transition: width 0.3s ease;
}

/* Snowy glow */
.snow-glow {
  position: absolute;
  top: -30%;
  left: -30%;
  right: -30%;
  bottom: -30%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(180, 220, 255, 0.08) 0%,
    transparent 70%
  );
  animation: shimmer 6s ease-in-out infinite alternate;
  border-radius: 50%;
  z-index: -1;
}
@keyframes shimmer {
  from {
    opacity: 0.4;
    transform: scale(1);
  }
  to {
    opacity: 0.9;
    transform: scale(1.15);
  }
}

.music-inner {
  /* existing styles */
  position: relative;
}

.play-btn {
  position: relative;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-progress {
  background: rgba(255, 255, 255, 0.05);
}

.loading-bar {
  background: linear-gradient(90deg, #9fd1ff, #6ba7ff);
  animation: loading-pulse 1.5s ease-in-out infinite;
  width: 40% !important; /* Fixed width for loading animation */
}

@keyframes loading-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Optional: Add a tooltip for better UX */
.play-btn {
  position: relative;

  &::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }

  &[disabled]:hover::before {
    content: "Loading...";
  }
}
</style>
