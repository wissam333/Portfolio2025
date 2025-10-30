<template>
  <div class="snow-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
const canvas = ref(null);

onMounted(() => {
  initSnowEffect();
});

function initSnowEffect() {
  if (!canvas.value) return;

  const canvasEl = canvas.value;
  const ctx = canvasEl.getContext("2d");

  function resize() {
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // Create advanced snowflakes
  const snowflakes = [];
  const snowflakeCount = 100;

  for (let i = 0; i < snowflakeCount; i++) {
    const type = Math.floor(Math.random() * 3); // 3 different snowflake types
    snowflakes.push({
      x: Math.random() * canvasEl.width,
      y: Math.random() * canvasEl.height,
      radius: Math.random() * 4 + 1,
      speed: Math.random() * 3 + 1,
      wind: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      swing: Math.random() * 0.02,
      swingOffset: Math.random() * Math.PI * 2,
      type: type,
    });
  }

  function drawSnowflake(flake) {
    ctx.save();
    ctx.translate(flake.x, flake.y);
    ctx.globalAlpha = flake.opacity;
    ctx.fillStyle = "white";

    switch (flake.type) {
      case 0:
        // Simple circle
        ctx.beginPath();
        ctx.arc(0, 0, flake.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 1:
        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(
            Math.cos(angle) * flake.radius,
            Math.sin(angle) * flake.radius
          );
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 2:
        // Cross shape
        ctx.beginPath();
        ctx.rect(
          -flake.radius / 3,
          -flake.radius,
          flake.radius / 1.5,
          flake.radius * 2
        );
        ctx.rect(
          -flake.radius,
          -flake.radius / 3,
          flake.radius * 2,
          flake.radius / 1.5
        );
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  function updateSnowflakes() {
    const time = Date.now() * 0.001;

    for (let i = 0; i < snowflakes.length; i++) {
      const flake = snowflakes[i];

      // Move snowflake down with swinging motion
      flake.y += flake.speed;
      flake.x += flake.wind + Math.sin(time + flake.swingOffset) * flake.swing;

      // Reset if out of bounds
      if (flake.y > canvasEl.height) {
        flake.y = -20;
        flake.x = Math.random() * canvasEl.width;
      }

      // Wrap around horizontally
      if (flake.x > canvasEl.width + 20) {
        flake.x = -20;
      } else if (flake.x < -20) {
        flake.x = canvasEl.width + 20;
      }
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    updateSnowflakes();

    for (let i = 0; i < snowflakes.length; i++) {
      drawSnowflake(snowflakes[i]);
    }

    requestAnimationFrame(animate);
  }

  animate();
}
</script>

<style scoped>
.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
