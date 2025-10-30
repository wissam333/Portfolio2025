<template>
  <div class="body" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <canvas ref="canvas"></canvas>
    <h1 class="fw-bold">
      {{ $i18n.locale === "ar" ? "لقد فعلتها!" : "You did it!" }}
    </h1>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "empty",
});

const canvas = ref(null);
const fallbackEffect = ref(false);

onMounted(() => {
  initFluidSimulation();
});

function initFluidSimulation() {
  if (!canvas.value) return;

  const canvasEl = canvas.value;

  // Try WebGL first
  if (!initWebGLFluid(canvasEl)) {
    // If WebGL fails, use canvas 2D fallback
    console.log("WebGL not supported, using fallback effect");
    initFallbackEffect(canvasEl);
  }
}

function initWebGLFluid(canvasEl) {
  try {
    // Get WebGL context
    const gl =
      canvasEl.getContext("webgl2") ||
      canvasEl.getContext("webgl") ||
      canvasEl.getContext("experimental-webgl");
    if (!gl) {
      return false;
    }

    // Test if WebGL is working
    gl.viewport(0, 0, 1, 1);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Reset to proper size
    resizeCanvas(canvasEl);

    // Simplified fluid configuration for mobile
    const config = {
      TEXTURE_DOWNSAMPLE: 2,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_ITERATIONS: 10,
      CURL: 15,
      SPLAT_RADIUS: 0.004,
    };

    // Simple vertex shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(
      vertShader,
      `
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `
    );
    gl.compileShader(vertShader);

    // Simple fragment shader for display
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(
      fragShader,
      `
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float time;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        // Add some simple movement
        vec2 movedUV = uv + vec2(sin(time + uv.y * 3.14) * 0.01, cos(time + uv.x * 3.14) * 0.01);
        vec4 movedColor = texture2D(texture, movedUV);
        
        gl_FragColor = mix(color, movedColor, 0.3);
      }
    `
    );
    gl.compileShader(fragShader);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("WebGL program failed to link");
    }

    gl.useProgram(program);

    // Create geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Create framebuffer
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    const timeUniform = gl.getUniformLocation(program, "time");
    const textureUniform = gl.getUniformLocation(program, "texture");

    let lastTime = 0;
    let particles = [];

    // Initialize some particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        color: [Math.random(), Math.random(), Math.random()],
      });
    }

    function updateTexture() {
      const width = canvasEl.width;
      const height = canvasEl.height;

      // Create particle data
      const data = new Uint8Array(width * height * 4);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= 1) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= 1) particle.vy *= -1;

        // Draw particle
        const x = Math.floor(particle.x * width);
        const y = Math.floor(particle.y * height);

        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (y * width + x) * 4;
          data[index] = particle.color[0] * 255; // R
          data[index + 1] = particle.color[1] * 255; // G
          data[index + 2] = particle.color[2] * 255; // B
          data[index + 3] = 255; // A
        }
      });

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );
    }

    function animate(currentTime) {
      if (fallbackEffect.value) return; // Stop if fallback activated

      resizeCanvas(canvasEl);

      const time = currentTime * 0.001;

      // Update texture with particles
      updateTexture();

      // Render
      gl.uniform1f(timeUniform, time);
      gl.uniform1i(textureUniform, 0);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(animate);
    }

    // Start animation
    requestAnimationFrame(animate);

    // Add interaction
    setupWebGLInteraction(canvasEl, particles);

    return true;
  } catch (error) {
    console.error("WebGL fluid simulation failed:", error);
    return false;
  }
}

function initFallbackEffect(canvasEl) {
  fallbackEffect.value = true;

  const ctx = canvasEl.getContext("2d");
  if (!ctx) return;

  resizeCanvas(canvasEl);

  const particles = [];
  const particleCount = 100;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvasEl.width,
      y: Math.random() * canvasEl.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    });
  }

  function animate() {
    if (!fallbackEffect.value) return; // Stop if WebGL is active

    resizeCanvas(canvasEl);

    // Clear with fade effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    // Update and draw particles
    particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off walls
      if (particle.x <= 0 || particle.x >= canvasEl.width) particle.vx *= -1;
      if (particle.y <= 0 || particle.y >= canvasEl.height) particle.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      // Draw connections
      particles.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${
            0.2 * (1 - distance / 100)
          })`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  // Add mouse/touch interaction for fallback
  setupFallbackInteraction(canvasEl, particles, ctx);

  // Start animation
  animate();
}

function setupWebGLInteraction(canvasEl, particles) {
  let mouseDown = false;
  let lastX = 0;
  let lastY = 0;

  canvasEl.addEventListener("mousedown", (e) => {
    mouseDown = true;
    const rect = canvasEl.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  });

  canvasEl.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;

    const rect = canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new particle at mouse position
    particles.push({
      x: x / canvasEl.width,
      y: y / canvasEl.height,
      vx: (x - lastX) * 0.01,
      vy: (y - lastY) * 0.01,
      color: [Math.random(), Math.random(), Math.random()],
    });

    // Keep particle count manageable
    if (particles.length > 100) {
      particles.splice(0, particles.length - 80);
    }

    lastX = x;
    lastY = y;
  });

  canvasEl.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  // Touch events
  canvasEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    mouseDown = true;
    const rect = canvasEl.getBoundingClientRect();
    lastX = e.touches[0].clientX - rect.left;
    lastY = e.touches[0].clientY - rect.top;
  });

  canvasEl.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!mouseDown) return;

    const rect = canvasEl.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    particles.push({
      x: x / canvasEl.width,
      y: y / canvasEl.height,
      vx: (x - lastX) * 0.01,
      vy: (y - lastY) * 0.01,
      color: [Math.random(), Math.random(), Math.random()],
    });

    if (particles.length > 100) {
      particles.splice(0, particles.length - 80);
    }

    lastX = x;
    lastY = y;
  });

  canvasEl.addEventListener("touchend", () => {
    mouseDown = false;
  });
}

function setupFallbackInteraction(canvasEl, particles, ctx) {
  let mouseDown = false;

  canvasEl.addEventListener("mousedown", (e) => {
    mouseDown = true;
    addParticlesAt(e.clientX, e.clientY, 10);
  });

  canvasEl.addEventListener("mousemove", (e) => {
    if (mouseDown) {
      addParticlesAt(e.clientX, e.clientY, 5);
    }
  });

  canvasEl.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvasEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    mouseDown = true;
    addParticlesAt(e.touches[0].clientX, e.touches[0].clientY, 10);
  });

  canvasEl.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (mouseDown) {
      addParticlesAt(e.touches[0].clientX, e.touches[0].clientY, 5);
    }
  });

  canvasEl.addEventListener("touchend", () => {
    mouseDown = false;
  });

  function addParticlesAt(clientX, clientY, count) {
    const rect = canvasEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 4 + 2,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      });
    }

    // Limit particle count
    if (particles.length > 200) {
      particles.splice(0, particles.length - 150);
    }
  }
}

function resizeCanvas(canvasEl) {
  const displayWidth = canvasEl.clientWidth;
  const displayHeight = canvasEl.clientHeight;

  if (canvasEl.width !== displayWidth || canvasEl.height !== displayHeight) {
    canvasEl.width = displayWidth;
    canvasEl.height = displayHeight;
  }
}
</script>

<style scoped>
.body {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

canvas {
  width: 100%;
  height: 100vh;
  display: block;
  touch-action: none;
}

h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 32px;
  user-select: none;
  text-wrap: nowrap;
  text-align: center;
  pointer-events: none;
  z-index: 10;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 700;
}

/* Better responsive font sizes */
@media (max-width: 480px) {
  h1 {
    font-size: 28px;
  }
}

@media (min-width: 768px) {
  h1 {
    font-size: 48px;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 60px;
  }
}
</style>
