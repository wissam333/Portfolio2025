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
  @media (max-width: 768px) {
    width: 30px;
  }
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
  border-radius: 16px;
  max-width: 180px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  top: -30px;
  inset-inline-end: 70px;

  @media (max-width: 768px) {
    top: -30px;
    inset-inline-end: 30px;
    font-size: 10px;
  }

  &::after {
    content: "";
    position: absolute;
    inset-inline-end: -10px;
    bottom: -20px;
    transform: translateY(-50%) rotate(-135deg);
    border-width: 10px;
    border-style: solid;
    border-color: transparent white transparent transparent;
  }
}
</style>
