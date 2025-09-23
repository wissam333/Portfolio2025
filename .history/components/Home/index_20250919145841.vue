<template>
  <div class="home">
    <!-- Falling Stars Background -->
    <div class="stars-container" @mousemove="handleMouseMove">
      <div class="stars">
        <span 
          v-for="n in 30" 
          :key="n" 
          :style="getStarStyle(n)"
          :class="{ 'star-hover': hoveredStar === n }"
          class="star"
          ref="stars"
        ></span>
      </div>
      
      <!-- Shine effect element -->
      <div class="shine-effect" :style="shineStyle"></div>
    </div>

    <!-- Main content -->
    <main class="content">
      <div class="type_effect">
        <div class="container">
          <p class="intro-text" ref="introText">Hi, I'm</p>

          <p class="name" ref="name">Wissam Najjom</p>

          <p class="role" ref="role">Front End Developer</p>

          <div class="button-group">
            <a href="#" class="btn btn-primary">Contact Me</a>
            <a href="#" class="btn btn-secondary">Download CV</a>
          </div>
        </div>
      </div>
    </main>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <span>Scroll down</span>
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Mouse position and hover state
const mouseX = ref(0);
const mouseY = ref(0);
const hoveredStar = ref(null);
const shineStyle = ref({});
const stars = ref([]);

// Handle mouse movement
const handleMouseMove = (event) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
  
  // Check if mouse is near any star
  checkStarProximity();
};

// // Check if mouse is near any star
// const checkStarProximity = () => {
//   if (!stars.value.length) return;
  
//   let closestStar = null;
//   let minDistance = 100; // Distance threshold
  
//   stars.value.forEach((star, index) => {
//     if (star) {
//       const rect = star.getBoundingClientRect();
//       const starX = rect.left + rect.width / 2;
//       const starY = rect.top + rect.height / 2;
      
//       // Calculate distance between mouse and star
//       const distance = Math.sqrt(
//         Math.pow(mouseX.value - starX, 2) + 
//         Math.pow(mouseY.value - starY, 2)
//       );
      
//       // If within threshold, this is the closest star
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestStar = index + 1;
        
//         // Update shine effect position
//         shineStyle.value = {
//           left: `${starX}px`,
//           top: `${starY}px`,
//           opacity: 1 - (distance / 100),
//           transform: `scale(${2 - (distance / 50)})`
//         };
//       }
//     }
//   });
  
//   // Update hovered star
//   hoveredStar.value = closestStar;
// };

// Generate random properties for more natural stars
const getStarStyle = (index) => {
  const size = Math.random() * 3 + 1;
  const opacity = Math.random() * 0.7 + 0.3;
  const animationDuration = Math.random() * 10 + 3 + "s";
  const animationDelay = Math.random() * 5 + "s";
  const left = Math.random() * 100 + "%";
  const trailLength = Math.floor(Math.random() * 100 + 150) + "px";

  return {
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity,
    animationDuration: animationDuration,
    animationDelay: animationDelay,
    left: left,
    "--trailLength": trailLength,
  };
};

// Refs for text animation elements
const introText = ref(null);
const name = ref(null);
const role = ref(null);

onMounted(() => {
  // Animate elements when component is mounted
  setTimeout(() => {
    if (introText.value) introText.value.classList.add("animate");
  }, 500);

  setTimeout(() => {
    if (name.value) name.value.classList.add("animate");
  }, 1500);

  setTimeout(() => {
    if (role.value) role.value.classList.add("animate");
  }, 2500);
  
  // Add loaded class to content after all animations complete
  setTimeout(() => {
    document.querySelector(".content")?.classList.add("loaded");
  }, 3000);
  
  // Add mousemove listener
  window.addEventListener('mousemove', handleMouseMove);
});
</script>

<style lang="scss" scoped>
$text-color: #fff;
$primary-color: #4fc08d;
$transition-speed: 0.3s;

.home {
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0d0d1a, #000);
}

/* Falling Stars Container */
.stars-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;

  span {
    position: absolute;
    top: -20px; // Start above the screen
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    opacity: 0;
    box-shadow: 0 0 6px #fff, 0 0 12px rgba(255, 255, 255, 0.7);
    animation-name: fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    transition: all 0.5s ease;
    z-index: 2;

    
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: var(--trailLength, 200px);
      height: 1px;
      background: linear-gradient(
        90deg,
        #fff,
        rgba(255, 255, 255, 0.7),
        transparent
      );
      transform: translateY(-50%) rotate(45deg);
      transform-origin: left center;
      opacity: 0;
      animation: trailFade var(--animationDuration) linear infinite
        var(--animationDelay);
      pointer-events: none;
    }
    
    /* Hover effect for stars */
    &.star-hover {
      transform: scale(3);
      opacity: 1 !important;
      box-shadow: 0 0 20px #fff, 0 0 30px rgba(255, 255, 255, 0.8);
      animation-play-state: paused;
      
      &::before {
        opacity: 1;
        width: calc(var(--trailLength) * 1.5);
        background: linear-gradient(
          90deg,
          #fff,
          rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.7),
          transparent
        );
      }
    }
  }

  @keyframes fall {
    0% {
      transform: translateY(0) translateX(0) rotate(45deg);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(120vh) translateX(-60vw) rotate(45deg);
      opacity: 0;
    }
  }

  @keyframes trailFade {
    0% {
      opacity: 0;
      width: 0;
    }
    10% {
      opacity: 0.9;
    }
    20% {
      opacity: 0.8;
      width: var(--trailLength, 200px);
    }
    80% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      width: var(--trailLength, 200px);
    }
  }
}

/* Shine effect */
.shine-effect {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1;
}

/* Content */
.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: $text-color;
  font-family: "Arial", sans-serif;
  padding: 2rem;
}

/* Animated Intro Text */
.intro-text {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;

  &.animate {
    opacity: 0.9;
    transform: translateY(0);
  }
}

/* Animated Name with Gradient */
.name {
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #4fc08d, #64ffda, #4fc08d);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease, transform 1s ease;

  &.animate {
    opacity: 1;
    transform: translateY(0);
    animation: textShine 3s ease-in-out infinite alternate,
      float 6s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      $primary-color,
      transparent
    );
    opacity: 0.7;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.5s ease;
  }

  &.animate::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Animated Role */
.role {
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 1s ease, transform 1s ease;

  &.animate {
    opacity: 0.8;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

/* Buttons */
.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease 1.5s, transform 1s ease 1.5s;

  .content.loaded & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
}

.btn {
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  font-family: "Arial", sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all $transition-speed;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);

  .content.loaded & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: $primary-color;
    border-color: $primary-color;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
}

.btn-primary {
  background: rgba($primary-color, 0.2);
  transition: opacity 1s ease 2s, transform 1s ease 2s, background 0.3s ease;

  &:hover {
    background: $primary-color;
  }
}

.btn-secondary {
  background: transparent;
  transition: opacity 1s ease 2.2s, transform 1s ease 2.2s, background 0.3s ease;

  &:hover {
    background: $primary-color;
  }
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: $text-color;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
  animation: fadeIn 2s ease-out 3s both;

  span {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid $text-color;
    border-radius: 15px;
    position: relative;

    .wheel {
      width: 3px;
      height: 8px;
      background: $text-color;
      border-radius: 50%;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 2s infinite;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.7;
  }
}

@keyframes scroll {
  0% {
    opacity: 0;
    transform: translate(-50%, 0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
}
</style>