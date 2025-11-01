<template>
  <div class="creepy-snow-container" :class="{ 'blood-moon': bloodMoonActive }">
    <!-- Creepy Snowfall -->
    <div class="snowfall">
      <div
        v-for="(snowflake, index) in snowflakes"
        :key="index"
        class="snowflake-wrapper"
        :style="{ left: snowflake.left }"
      >
        <div
          class="snowflake"
          :class="{ 
            paused: hoveredSnowflake === index,
            whispering: snowflake.whispering,
            screaming: snowflake.screaming
          }"
          :style="{
            animationDuration: snowflake.animationDuration,
            animationDelay: snowflake.animationDelay,
            opacity: snowflake.opacity,
            filter: snowflake.filter
          }"
          @mouseenter="onSnowflakeEnter(index)"
          @mouseleave="onSnowflakeLeave"
          @click="onSnowflakeClick(index)"
        >
          <div
            class="snowflake-inner"
            :class="{ 
              hovered: hoveredSnowflake === index,
              'blood-snow': snowflake.bloody,
              'ash-snow': snowflake.ash
            }"
            :style="{
              '--size': snowflake.size + 'px',
              '--rotation': snowflake.rotation + 'deg',
              '--sway': snowflake.swayAmount + 'px'
            }"
          >
            <span v-if="snowflake.whispering" class="whisper-text">help...</span>
            <span v-if="snowflake.screaming" class="scream-text">✝</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Blood Moon -->
    <div 
      class="blood-moon" 
      :class="{ pulsating: bloodMoonPulse }"
      @click="toggleBloodMoon"
    >
      <div class="moon-veins"></div>
    </div>

    <!-- Creepy Messages -->
    <div v-if="showMessage" class="creepy-message" :class="messageType">
      {{ currentMessage }}
    </div>

    <!-- Floating Faces -->
    <div 
      v-for="face in floatingFaces" 
      :key="face.id"
      class="floating-face"
      :style="faceStyle(face)"
    >👁️</div>

    <!-- Audio Elements -->
    <audio ref="whisperAudio" loop>
      <!-- <source src="/creepy-whisper.mp3" type="audio/mpeg"> -->
    </audio>
    <audio ref="screamAudio">
      <!-- <source src="/scream.mp3" type="audio/mpeg"> -->
    </audio>
    <audio ref="heartbeatAudio" loop>
      <!-- <source src="/heartbeat.mp3" type="audio/mpeg"> -->
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Creepy state
const hoveredSnowflake = ref(null)
const bloodMoonActive = ref(false)
const bloodMoonPulse = ref(false)
const showMessage = ref(false)
const currentMessage = ref('')
const messageType = ref('whisper')
const whisperAudio = ref(null)
const screamAudio = ref(null)
const heartbeatAudio = ref(null)

// Floating faces
const floatingFaces = ref([])

// Creepy messages pool
const creepyMessages = [
  'they are watching...',
  'get out while you can',
  'it knows you\'re here',
  'the snow remembers',
  'don\'t look behind you',
  'they walk among us',
  'the moon bleeds for you',
  'your breath fogs... but why?',
  'count the flakes... you\'ll see',
  'it gets colder when they\'re near'
]

const screamMessages = [
  'LEAVE NOW!',
  'IT SEES YOU!',
  'BEHIND YOU!',
  'DON\'T TRUST THE SNOW!'
]

// Create creepy snowflakes
function createSnowflakes(count = 60) {
  const arr = []
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 5 + 2
    const opacity = Math.random() * 0.6 + 0.1
    const animationDuration = (Math.random() * 15 + 10).toFixed(2) + 's'
    const animationDelay = (Math.random() * 8).toFixed(2) + 's'
    const left = Math.random() * 100 + '%'
    const rotation = Math.random() * 360
    const swayAmount = Math.random() * 80 + 20
    const bloody = Math.random() < 0.1
    const ash = Math.random() < 0.15
    const whispering = Math.random() < 0.05
    const screaming = Math.random() < 0.02
    const filter = bloody ? 'hue-rotate(-50deg) brightness(1.2)' : 
                  ash ? 'grayscale(1) brightness(0.7)' : ''

    arr.push({
      size,
      opacity,
      animationDuration,
      animationDelay,
      left,
      rotation,
      swayAmount,
      bloody,
      ash,
      whispering,
      screaming,
      filter
    })
  }
  return arr
}

const snowflakes = ref(createSnowflakes(60))

// Snowflake interactions
const onSnowflakeEnter = (index) => {
  hoveredSnowflake.value = index
  const snowflake = snowflakes.value[index]
  
  if (snowflake.whispering && whisperAudio.value) {
    whisperAudio.value.currentTime = 0
    whisperAudio.value.play()
  }
  
  if (snowflake.screaming && screamAudio.value) {
    screamAudio.value.currentTime = 0
    screamAudio.value.play()
    showCreepyMessage(screamMessages[Math.floor(Math.random() * screamMessages.length)], 'scream')
  }
}

const onSnowflakeLeave = () => {
  hoveredSnowflake.value = null
}

const onSnowflakeClick = (index) => {
  const snowflake = snowflakes.value[index]
  if (snowflake.bloody) {
    triggerBloodEffect()
  }
  
  // Random chance to show message
  if (Math.random() < 0.3) {
    showCreepyMessage(creepyMessages[Math.floor(Math.random() * creepyMessages.length)], 'whisper')
  }
}

// Blood moon effects
const toggleBloodMoon = () => {
  bloodMoonActive.value = !bloodMoonActive.value
  bloodMoonPulse.value = true
  
  if (bloodMoonActive.value && heartbeatAudio.value) {
    heartbeatAudio.value.play()
    startFloatingFaces()
  } else {
    if (heartbeatAudio.value) heartbeatAudio.value.pause()
    floatingFaces.value = []
  }
  
  setTimeout(() => {
    bloodMoonPulse.value = false
  }, 1000)
}

const triggerBloodEffect = () => {
  // Convert some snowflakes to blood
  snowflakes.value.forEach(flake => {
    if (Math.random() < 0.3) {
      flake.bloody = true
      flake.filter = 'hue-rotate(-50deg) brightness(1.2)'
    }
  })
}

// Creepy messages
const showCreepyMessage = (message, type) => {
  currentMessage.value = message
  messageType.value = type
  showMessage.value = true
  
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

// Floating faces
const startFloatingFaces = () => {
  floatingFaces.value = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 20,
    speed: Math.random() * 2 + 1,
    rotation: Math.random() * 360
  }))
}

const faceStyle = (face) => ({
  left: `${face.x}%`,
  top: `${face.y}%`,
  fontSize: `${face.size}px`,
  transform: `rotate(${face.rotation}deg)`,
  animationDuration: `${face.speed}s`
})

// Animate floating faces
onMounted(() => {
  const animateFaces = () => {
    if (floatingFaces.value.length > 0) {
      floatingFaces.value.forEach(face => {
        face.x += (Math.random() - 0.5) * 0.5
        face.y += (Math.random() - 0.5) * 0.3
        face.rotation += (Math.random() - 0.5) * 2
        
        // Keep within bounds
        face.x = Math.max(0, Math.min(100, face.x))
        face.y = Math.max(0, Math.min(100, face.y))
      })
    }
    requestAnimationFrame(animateFaces)
  }
  animateFaces()
})

// Initialize
onMounted(() => {
  // Start with some blood snow
  setTimeout(() => {
    triggerBloodEffect()
  }, 5000)
})
</script>

<style scoped>
.creepy-snow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
  cursor: crosshair;
}

.creepy-snow-container.blood-moon {
  background: linear-gradient(180deg, #1a0000 0%, #0a0a0a 50%, #000000 100%);
}

/* Snowfall */
.snowfall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.snowflake-wrapper {
  position: absolute;
  top: -20px;
  pointer-events: auto;
}

.snowflake {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  animation-name: creepySnowFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transform: translate3d(0, 0, 0);
}

.snowflake.paused {
  animation-play-state: paused;
}

.snowflake.whispering {
  animation-timing-function: ease-in-out;
  filter: hue-rotate(120deg) blur(0.5px);
}

.snowflake.screaming {
  animation-duration: 3s !important;
  animation-timing-function: ease-out;
}

.snowflake-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: #a0a0a0;
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 
    0 0 3px #666,
    0 0 6px rgba(102, 102, 102, 0.4);
  transform: rotate(var(--rotation, 0deg));
  transition: all 0.4s ease;
  filter: blur(0.4px);
}

.snowflake-inner.blood-snow {
  background: #8b0000 !important;
  box-shadow: 
    0 0 4px #600,
    0 0 8px rgba(139, 0, 0, 0.6),
    0 0 12px rgba(255, 0, 0, 0.3) !important;
}

.snowflake-inner.ash-snow {
  background: #2a2a2a !important;
  box-shadow: 
    0 0 3px #000,
    0 0 6px rgba(0, 0, 0, 0.6) !important;
}

.snowflake-inner.hovered {
  transform: scale(2.5) rotate(calc(var(--rotation, 0deg) + 180deg));
  opacity: 1 !important;
  box-shadow: 
    0 0 20px #fff,
    0 0 40px #f00,
    0 0 60px #800 !important;
  filter: blur(0.1px) brightness(2);
  animation: bloodPulse 0.3s ease-in-out infinite;
}

.whisper-text, .scream-text {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px #0f0;
  white-space: nowrap;
  animation: textFlicker 2s infinite;
}

.scream-text {
  color: #ff0000;
  text-shadow: 0 0 10px #f00;
  font-size: 10px;
  animation: screamPulse 0.5s infinite;
}

/* Creepy falling animation */
@keyframes creepySnowFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg) scale(1);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.6);
    transform: translateY(0) translateX(calc(var(--sway, 0px) * 0.1)) rotate(90deg) scale(1.1);
  }
  30% {
    transform: translateY(30vh) translateX(calc(var(--sway, 0px) * 0.3)) rotate(180deg) scale(0.9);
  }
  50% {
    transform: translateY(50vh) translateX(calc(var(--sway, 0px) * 0.5)) rotate(270deg) scale(1.2);
  }
  70% {
    transform: translateY(70vh) translateX(calc(var(--sway, 0px) * 0.7)) rotate(360deg) scale(0.8);
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(100vh) translateX(calc(var(--sway, 0px) * 1)) rotate(450deg) scale(1);
    opacity: 0;
  }
}

@keyframes bloodPulse {
  0%, 100% { filter: brightness(2) blur(0.1px); }
  50% { filter: brightness(3) blur(0.3px); }
}

@keyframes textFlicker {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes screamPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.2); }
}

/* Blood Moon */
.blood-moon {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #8b0000 0%, #400000 70%, #200000 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 
    0 0 60px #800,
    0 0 120px #400;
  transition: all 1s ease;
  z-index: 10;
}

.blood-moon.pulsating {
  animation: moonPulse 1s ease-in-out;
}

.moon-veins {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 30% 30%, transparent 50%, rgba(0, 0, 0, 0.3) 100%),
    linear-gradient(45deg, transparent 40%, rgba(0, 0, 0, 0.2) 100%);
}

@keyframes moonPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Creepy Messages */
.creepy-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Courier New', monospace;
  font-size: 24px;
  padding: 20px 40px;
  border-radius: 10px;
  z-index: 100;
  animation: messageAppear 0.5s ease-out;
}

.creepy-message.whisper {
  background: rgba(0, 20, 0, 0.8);
  color: #0f0;
  border: 1px solid #0f0;
  text-shadow: 0 0 10px #0f0;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
}

.creepy-message.scream {
  background: rgba(40, 0, 0, 0.9);
  color: #f00;
  border: 1px solid #f00;
  text-shadow: 0 0 15px #f00;
  box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
  animation: screamShake 0.1s infinite;
}

@keyframes messageAppear {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes screamShake {
  0%, 100% { transform: translate(-50%, -50%) translateX(0); }
  25% { transform: translate(-50%, -50%) translateX(-2px); }
  75% { transform: translate(-50%, -50%) translateX(2px); }
}

/* Floating Faces */
.floating-face {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  animation: floatCreepily 10s infinite ease-in-out;
  filter: brightness(0.8) contrast(1.2);
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

@keyframes floatCreepily {
  0%, 100% { 
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-20px) rotate(90deg) scale(1.1);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(0) rotate(180deg) scale(0.9);
    opacity: 0.4;
  }
  75% { 
    transform: translateY(20px) rotate(270deg) scale(1.05);
    opacity: 0.7;
  }
}

/* Snow pile with blood stains */
.creepy-snow-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: linear-gradient(
    to top,
    rgba(139, 0, 0, 0.1) 0%,
    rgba(139, 0, 0, 0.05) 20%,
    transparent 100%
  );
  backdrop-filter: blur(3px);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .creepy-message {
    font-size: 18px;
    padding: 15px 30px;
  }
  
  .blood-moon {
    width: 60px;
    height: 60px;
  }
}
</style>