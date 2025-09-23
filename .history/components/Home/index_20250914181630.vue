<template>
  <div class="handwriting-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 200"
      class="handwriting-svg"
    >
      <path
        class="handwriting-path"
        d="M50,150 C80,20 150,20 200,150 C240,260 320,20 380,150 C420,260 500,20 550,150"
        stroke="black"
        fill="transparent"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup>
// nothing needed here for basic animation
</script>

<style scoped>
.handwriting-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* adjust size as needed */
}

.handwriting-svg {
  width: 100%;
  max-width: 600px;
  height: auto;
}

.handwriting-path {
  stroke-dasharray: 800; /* approximate path length, adjust after generating your own path */
  stroke-dashoffset: 800;
  animation: drawWissam 4s ease forwards;
}

@keyframes drawWissam {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
