<template>
  <div :class="['music-box', positionClass]">
    <div class="music-inner">
      <!-- Header -->
      <div class="header">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 3v10.55A4 4 0 1014 17V7h4V3z" />
        </svg>
        <span class="title">Now Playing</span>
      </div>

      <!-- Song Info -->
      <div class="song-info">
        <span class="name">{{ songName }}</span>
        <button class="play-btn" @click="togglePlay">
          <svg v-if="!isPlaying" class="btn-icon" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6zm8-14v14h4V5z" />
          </svg>
        </button>
      </div>

      <!-- Progress -->
      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Snowy glow -->
    <div class="snow-glow"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  position: { type: String, default: "bottom-right" }, // corner position
});

// Song data
const songUrl = "/savior.mp3"; // 👉 replace with your song link
const songName = "Savior";

const audio = new Audio(songUrl);
const isPlaying = ref(false);
const progress = ref(0);

const togglePlay = () => {
  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying.value = !isPlaying.value;
};

const updateProgress = () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
};

onMounted(() => {
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => (isPlaying.value = false));
});

onUnmounted(() => {
  audio.pause();
  audio.removeEventListener("timeupdate", updateProgress);
});

const positionClass = computed(() => {
  switch (props.position) {
    case "top-left":
      return "pos-top-left";
    case "top-right":
      return "pos-top-right";
    case "bottom-right":
      return "pos-bottom-right";
    default:
      return "pos-bottom-left";
  }
});
</script>

<style scoped>
.music-box {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}
.pos-bottom-left {
  bottom: 20px;
  left: 20px;
}
.pos-bottom-right {
  bottom: 20px;
  right: 20px;
}
.pos-top-left {
  top: 20px;
  left: 20px;
}
.pos-top-right {
  top: 20px;
  right: 20px;
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.21), 0 0 25px rgba(140, 180, 255, 0.045);
  color: #e6f0ff;
  font-family: "Inter", sans-serif;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 8px;
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
}
.play-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.btn-icon {
  width: 20px;
  height: 20px;
  fill: #fff;
}

/* Progress */
.progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
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
</style>
