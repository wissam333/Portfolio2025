<template>
  <div class="handwriting">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 100"
      class="svg-text"
    >
      <!-- This path should be generated from your actual handwriting font -->
      <path
        d="M20 80 Q40 10, 80 80 T160 80 T240 80 T320 80 T400 80"
        stroke="white"
        fill="transparent"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup>
// no JS needed for pure CSS animation
</script>

<style scoped>
.handwriting {
  background: black; /* Just for visibility */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.svg-text path {
  stroke-dasharray: 1000; /* Length of the path */
  stroke-dashoffset: 1000;
  animation: handwriting 4s linear forwards;
}

@keyframes handwriting {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
