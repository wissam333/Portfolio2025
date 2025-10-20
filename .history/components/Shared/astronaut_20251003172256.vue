<template>
  <div class="astronaut">
    <img class="normal" src="/photos/1.png" alt="astronaut" />

    <div class="speech-bubble">Hello, I'm your space guide! 🌌</div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.normal {
  position: fixed;
  inset-inline-end: 10px;
  top: 20%;
  z-index: 15;
  width: 70px;
}

.astronaut {
  position: fixed;
  inset-inline-end: 10px;
  top: 20%;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
}

.speech-bubble {
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 180px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  top: 0px;

  &::after {
    content: "";
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent white transparent transparent;
  }
}
</style>
