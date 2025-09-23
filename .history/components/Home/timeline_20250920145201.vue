<template>
  <section class="timeline-section">
    <h2 class="section-title">Experience & Learning Journey</h2>

    <div class="timeline" v-if="data?.length">
      <div v-for="(item, index) in data" :key="index" class="timeline-item">
        <div class="timeline-circle"></div>
        <div class="timeline-connector"></div>
        <div class="timeline-content">
          <span class="timeline-date">{{ item.date }}</span>
          <h3 class="timeline-title">{{ item.title }}</h3>
          <p class="timeline-description" v-html="item.description"></p>
        </div>
      </div>
    </div>

    <!-- Floating cosmic lights -->
    <div class="timeline-stars">
      <span
        v-for="n in 30"
        :key="n"
        class="star"
        :style="getStarStyle(n)"
      ></span>
    </div>
  </section>
</template>

<script setup>
const { data } = await useFetch("/api/timeline");

function getStarStyle(n) {
  const size = Math.random() * 3 + 1;
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, rgba(255,255,255,${Math.random()}) 0%, transparent 70%)`,
    animationDuration: `${Math.random() * 5 + 3}s`,
  };
}
</script>

<style scoped>
.timeline-section {
  position: relative;
  padding: 4rem 2rem;
  background: radial-gradient(circle at top, #0c0c1f, #1a1a3f);
  color: #fff;
  overflow: hidden;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 15px #ff6ec4;
}

/* Vertical timeline */
.timeline {
  position: relative;
  margin: 0 auto;
  width: 4px;
  background: linear-gradient(to bottom, #ff6ec4, #7873f5);
  border-radius: 2px;
}

/* Timeline item */
.timeline-item {
  position: relative;
  margin: 2rem 0;
  display: flex;
  align-items: center;
}

.timeline-circle {
  width: 20px;
  height: 20px;
  background: #ff6ec4;
  border-radius: 50%;
  box-shadow: 0 0 15px #ff6ec4, 0 0 30px #7873f5;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  transition: transform 0.3s, box-shadow 0.3s;
}

.timeline-item:hover .timeline-circle {
  transform: translateX(-50%) scale(1.3);
  box-shadow: 0 0 25px #ff6ec4, 0 0 50px #7873f5;
}

/* Connector line */
.timeline-connector {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, #ff6ec4, #7873f5);
  margin-left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

/* Timeline content */
.timeline-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  max-width: 300px;
  margin-left: 60px;
  transition: transform 0.5s, box-shadow 0.5s;
}

.timeline-item:hover .timeline-content {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(255, 110, 196, 0.5);
}

.timeline-date {
  font-weight: bold;
  color: #ff6ec4;
  display: block;
  margin-bottom: 0.5rem;
}

.timeline-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.timeline-description {
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Floating cosmic lights */
.timeline-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.timeline-stars .star {
  position: absolute;
  border-radius: 50%;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.5);
  }
}
</style>
