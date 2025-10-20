--- FILE: components/Astronaut.vue ---
<template>
  <div class="astronaut">
    <img class="normal" src="/photos/1.png" alt="astronaut" />

    <!-- speech bubble -->
    <div class="speech-bubble">Hello, I'm your space guide! 🌌</div>
  </div>
</template>

<script setup>
// you can later add props to control text dynamically
</script>

<style lang="scss" scoped>
.normal {
  position: fixed;
  inset-inline-end: 10px;
  top: 20%;
  z-index: 15;
  width: 70px;
}

/* astronaut container */
.astronaut {
  position: fixed;
  inset-inline-end: 10px;
  top: 20%;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px; // space between astronaut and bubble
}

/* speech bubble styling */
.speech-bubble {
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 180px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  /* arrow pointing to astronaut */
  &::after {
    content: "";
    position: absolute;
    left: -8px; /* adjust depending on astronaut side */
    top: 50%;
    transform: translateY(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent white transparent transparent;
  }
}
</style>
