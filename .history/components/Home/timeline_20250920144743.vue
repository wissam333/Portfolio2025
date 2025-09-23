<template>
  <section class="timeline-section">
    <h2 class="section-title">Experience & Learning Journey</h2>

    <div class="timeline" v-if="timeline.length">
      <div
        v-for="(item, index) in timeline"
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
import { ref } from "vue";

const timeline = ref([]);

const { data, error } = await useFetch("/api/timeline");

if (!error.value && data.value) {
  timeline.value = data.value;
}

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
/* Keep the same CSS as before */
</style>
