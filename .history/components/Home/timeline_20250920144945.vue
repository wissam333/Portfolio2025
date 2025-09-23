<template>
  <section class="timeline-section">
    <h2 class="section-title">Experience & Learning Journey</h2>

    <div class="timeline" v-if="data?.length">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="timeline-item"
        :class="{ left: index % 2 === 0, right: index % 2 !== 0 }"
      >
        <div class="timeline-content">
          <span class="timeline-date">{{ item.date }}</span>
          <h3 class="timeline-title">{{ item.title }}</h3>
          <p class="timeline-description" v-html="item.description"></p>
        </div>
        <div class="timeline-circle"></div>
      </div>
    </div>

    <!-- Floating stars -->
    <div class="timeline-stars">
      <span
        v-for="n in 20"
        :key="n"
        class="star"
        :style="getStarStyle(n)"
      ></span>
    </div>
  </section>
</template>

<script setup>
const { data, error } = await useFetch("/api/timeline");

// Floating stars style
function getStarStyle(n) {
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 2}px`,
    height: `${Math.random() * 3 + 2}px`,
    background: "#fff",
    opacity: Math.random(),
  };
}
</script>

<style scoped>
.timeline-section {
  position: relative;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #0f0f2e, #1a1a3f);
  color: #fff;
  overflow: hidden;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
}

/* Timeline line */
.timeline {
  position: relative;
  margin: 0 auto;
  padding: 2rem 0;
  width: 90%;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #ff6ec4, #7873f5);
  transform: translateX(-50%);
  z-index: 1;
}

/* Timeline item */
.timeline-item {
  position: relative;
  width: 45%;
  padding: 1rem 2rem;
  box-sizing: border-box;
}

.timeline-item.left {
  left: 0;
  text-align: right;
}

.timeline-item.right {
  left: 55%;
  text-align: left;
}

.timeline-circle {
  position: absolute;
  top: 1rem;
  left: 50%;
  width: 16px;
  height: 16px;
  background: #ff6ec4;
  border: 3px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 10px rgba(255, 110, 196, 0.8);
}

/* Content */
.timeline-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  position: relative;
  z-index: 2;
  transition: transform 0.5s, box-shadow 0.5s;
}

.timeline-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 110, 196, 0.5);
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

/* Floating stars decoration */
.timeline-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.timeline-stars .star {
  position: absolute;
  border-radius: 50%;
  animation: twinkle 3s infinite alternate;
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.5);
  }
}
</style>
