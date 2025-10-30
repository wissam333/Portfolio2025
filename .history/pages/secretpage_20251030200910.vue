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

onMounted(() => {
  initFluidSimulation();
});

// Put these class/function definitions BEFORE the initialization code:

class GLProgram {
  constructor(vertexShader, fragmentShader) {
    this.uniforms = {};
    this.program = gl.createProgram();

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
      throw gl.getProgramInfoLog(this.program);

    const uniformCount = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(this.program, i).name;
      this.uniforms[uniformName] = gl.getUniformLocation(
        this.program,
        uniformName
      );
    }
  }

  bind() {
    gl.useProgram(this.program);
  }
}

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw gl.getShaderInfoLog(shader);

  return shader;
}

function initFramebuffers() {
  textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
  textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

  const texType = ext.halfFloatTexType;
  const rgba = ext.formatRGBA;
  const rg = ext.formatRG;
  const r = ext.formatR;

  density = createDoubleFBO(
    2,
    textureWidth,
    textureHeight,
    rgba.internalFormat,
    rgba.format,
    texType,
    ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
  );
  velocity = createDoubleFBO(
    0,
    textureWidth,
    textureHeight,
    rg.internalFormat,
    rg.format,
    texType,
    ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
  );
  divergence = createFBO(
    4,
    textureWidth,
    textureHeight,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  );
  curl = createFBO(
    5,
    textureWidth,
    textureHeight,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  );
  pressure = createDoubleFBO(
    6,
    textureWidth,
    textureHeight,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  );
}

function createFBO(texId, w, h, internalFormat, format, type, param) {
  gl.activeTexture(gl.TEXTURE0 + texId);
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  let fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return [texture, fbo, texId];
}

function createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
  let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
  let fbo2 = createFBO(texId + 1, w, h, internalFormat, format, type, param);

  return {
    get read() {
      return fbo1;
    },
    get write() {
      return fbo2;
    },
    swap() {
      let temp = fbo1;
      fbo1 = fbo2;
      fbo2 = temp;
    },
  };
}

// Don't forget your update(), multipleSplats(), resizeCanvas() functions too!

function initFluidSimulation() {
  if (!canvas.value) return;

  // Better performance detection
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // More accurate performance detection
  const getPerformanceTier = () => {
    if (isMobile) {
      // Check for high-end mobile devices
      const isHighEndMobile =
        /iPhone (1[3-9]|[2-9][0-9])|iPad ([7-9]|[1-9][0-9])|Samsung Galaxy S(2[0-9]|[3-9][0-9])/.test(
          navigator.userAgent
        ) ||
        (navigator.deviceMemory && navigator.deviceMemory >= 4) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 6);

      return isHighEndMobile ? "medium" : "low";
    }

    // Desktop - assume medium to high performance
    return "high";
  };

  const performanceTier = getPerformanceTier();

  const canvasEl = canvas.value;

  // Try to get WebGL context with better error handling
  let gl = null;
  let isWebGL2 = false;

  // Try different context types
  const contextTypes = ["webgl2", "webgl", "experimental-webgl"];
  const contextAttributes = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    powerPreference: "default",
    failIfMajorPerformanceCaveat: false,
  };

  for (const contextType of contextTypes) {
    try {
      gl = canvasEl.getContext(contextType, contextAttributes);
      if (gl) {
        isWebGL2 = contextType === "webgl2";
        console.log(`Using ${contextType} context`);
        break;
      }
    } catch (e) {
      console.warn(`${contextType} failed:`, e);
    }
  }

  if (!gl) {
    console.error("WebGL not supported on this device");
    showFallbackMessage();
    return;
  }

  // Test WebGL capabilities
  try {
    gl.getParameter(gl.VERSION);
  } catch (e) {
    console.error("WebGL context not usable:", e);
    showFallbackMessage();
    return;
  }

  canvasEl.width = Math.min(canvasEl.clientWidth, 2048); // Limit maximum size
  canvasEl.height = Math.min(canvasEl.clientHeight, 2048);

  // Adaptive configuration based on performance tier
  let config = {
    TEXTURE_DOWNSAMPLE:
      performanceTier === "low" ? 2 : performanceTier === "medium" ? 1 : 1,
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE_DISSIPATION: 0.8,
    PRESSURE_ITERATIONS:
      performanceTier === "low" ? 10 : performanceTier === "medium" ? 15 : 25,
    CURL:
      performanceTier === "low" ? 15 : performanceTier === "medium" ? 25 : 30,
    SPLAT_RADIUS: 0.005,
    SPLAT_FORCE: performanceTier === "low" ? 5.0 : 10.0,
  };

  console.log(`Performance tier: ${performanceTier}, Config:`, config);

  let pointers = [];
  let splatStack = [];

  const { ext } = getWebGLContext(canvasEl, gl, isWebGL2);

  if (!ext) {
    console.error("WebGL extensions not supported");
    showFallbackMessage();
    return;
  }

  function showFallbackMessage() {
    // You could show a static background or message here
    console.log("Showing fallback for non-WebGL devices");
  }

  function getWebGLContext(canvas, gl, isWebGL2) {
    let halfFloat = null;
    let supportLinearFiltering = false;

    try {
      if (isWebGL2) {
        halfFloat = { HALF_FLOAT: gl.HALF_FLOAT };

        // Try to enable linear filtering
        const linearFilteringExt = gl.getExtension("OES_texture_float_linear");
        supportLinearFiltering = !!linearFilteringExt;

        // Get other useful extensions
        gl.getExtension("EXT_color_buffer_float");
        gl.getExtension("EXT_color_buffer_half_float");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        if (halfFloat) {
          supportLinearFiltering = !!gl.getExtension(
            "OES_texture_half_float_linear"
          );
        } else {
          // Fallback to float if half_float not available
          halfFloat = { HALF_FLOAT_OES: gl.FLOAT };
          supportLinearFiltering = !!gl.getExtension(
            "OES_texture_float_linear"
          );
        }
      }
    } catch (e) {
      console.error("Error getting WebGL extensions:", e);
      return { ext: null };
    }

    if (!halfFloat) {
      console.error("No floating point texture support");
      return { ext: null };
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2
      ? gl.HALF_FLOAT
      : halfFloat.HALF_FLOAT_OES || gl.FLOAT;

    // Simplified format detection with fallbacks
    let formatRGBA, formatRG, formatR;

    try {
      if (isWebGL2) {
        // Try for high precision formats first, then fall back
        formatRGBA =
          getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType) ||
          getSupportedFormat(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);

        formatRG =
          getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType) ||
          getSupportedFormat(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);

        formatR =
          getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType) ||
          getSupportedFormat(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
      } else {
        // WebGL1 fallbacks
        formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
      }
    } catch (e) {
      console.error("Format detection failed, using basic formats:", e);
      formatRGBA =
        formatRG =
        formatR =
          { internalFormat: gl.RGBA, format: gl.RGBA };
    }

    return {
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    };
  }

  function getSupportedFormat(gl, internalFormat, format, type) {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      return null;
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(gl, internalFormat, format, type) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    try {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );
    } catch (e) {
      console.warn(
        `Texture format not supported: ${internalFormat}, ${format}, ${type}`
      );
      return false;
    }

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  }

  // [Rest of your WebGL fluid simulation code remains the same...]
  // pointerPrototype, GLProgram, compileShader, shader definitions, etc.

  function pointerPrototype() {
    this.id = -1;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.down = false;
    this.moved = false;
    this.color = [30, 0, 300];
  }

  pointers.push(new pointerPrototype());

  // [Include all your existing WebGL classes and functions here...]
  // GLProgram, compileShader, shader definitions, initFramebuffers, etc.

  // Modified splat function to use adaptive force
  function splat(x, y, dx, dy, color) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read[2]);
    gl.uniform1f(
      splatProgram.uniforms.aspectRatio,
      canvasEl.width / canvasEl.height
    );
    gl.uniform2f(
      splatProgram.uniforms.point,
      x / canvasEl.width,
      1.0 - y / canvasEl.height
    );
    gl.uniform3f(
      splatProgram.uniforms.color,
      dx * config.SPLAT_FORCE,
      -dy * config.SPLAT_FORCE,
      1.0
    );
    gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
    blit(velocity.write[1]);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, density.read[2]);
    gl.uniform3f(
      splatProgram.uniforms.color,
      color[0] * 0.3,
      color[1] * 0.3,
      color[2] * 0.3
    );
    blit(density.write[1]);
    density.swap();
  }

  // Event listeners with better touch handling
  function setupEventListeners() {
    // Mouse events
    canvasEl.addEventListener("mousemove", (e) => {
      const rect = canvasEl.getBoundingClientRect();
      pointers[0].moved = pointers[0].down;
      pointers[0].dx =
        (e.clientX - rect.left - pointers[0].x) * config.SPLAT_FORCE;
      pointers[0].dy =
        (e.clientY - rect.top - pointers[0].y) * config.SPLAT_FORCE;
      pointers[0].x = e.clientX - rect.left;
      pointers[0].y = e.clientY - rect.top;
    });

    canvasEl.addEventListener("mousedown", (e) => {
      const rect = canvasEl.getBoundingClientRect();
      pointers[0].down = true;
      pointers[0].x = e.clientX - rect.left;
      pointers[0].y = e.clientY - rect.top;
      pointers[0].color = [
        Math.random() + 0.2,
        Math.random() + 0.2,
        Math.random() + 0.2,
      ];
    });

    // Touch events with better handling
    canvasEl.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        const rect = canvasEl.getBoundingClientRect();
        const touches = e.targetTouches;

        for (let i = 0; i < touches.length; i++) {
          if (i >= pointers.length) {
            pointers.push(new pointerPrototype());
          }
          let pointer = pointers[i];
          pointer.moved = pointer.down;
          pointer.dx =
            (touches[i].clientX - rect.left - pointer.x) * config.SPLAT_FORCE;
          pointer.dy =
            (touches[i].clientY - rect.top - pointer.y) * config.SPLAT_FORCE;
          pointer.x = touches[i].clientX - rect.left;
          pointer.y = touches[i].clientY - rect.top;
        }
      },
      { passive: false }
    );

    canvasEl.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        const rect = canvasEl.getBoundingClientRect();
        const touches = e.targetTouches;

        for (let i = 0; i < touches.length; i++) {
          if (i >= pointers.length) pointers.push(new pointerPrototype());

          pointers[i].id = touches[i].identifier;
          pointers[i].down = true;
          pointers[i].x = touches[i].clientX - rect.left;
          pointers[i].y = touches[i].clientY - rect.top;
          pointers[i].color = [
            Math.random() + 0.2,
            Math.random() + 0.2,
            Math.random() + 0.2,
          ];
        }
      },
      { passive: false }
    );

    window.addEventListener("mouseup", () => {
      pointers[0].down = false;
    });

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        for (let j = 0; j < pointers.length; j++) {
          if (touches[i].identifier === pointers[j].id) {
            pointers[j].down = false;
          }
        }
      }
    });

    // Handle resize
    window.addEventListener("resize", () => {
      resizeCanvas();
    });
  }

  // Initialize and start the simulation
  try {
    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`
    );

    const advectionManualFilteringShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (in sampler2D sam, in vec2 p) {
        vec4 st;
        st.xy = floor(p - 0.5) + 0.5;
        st.zw = st.xy + 1.0;
        vec4 uv = st * texelSize.xyxy;
        vec4 a = texture2D(sam, uv.xy);
        vec4 b = texture2D(sam, uv.zy);
        vec4 c = texture2D(sam, uv.xw);
        vec4 d = texture2D(sam, uv.zw);
        vec2 f = p - st.xy;
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main () {
        vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
        gl_FragColor = dissipation * bilerp(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;

    vec2 sampleVelocity (in vec2 uv) {
        vec2 multiplier = vec2(1.0, 1.0);
        if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
        if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
        if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
        if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
        return multiplier * texture2D(uVelocity, uv).xy;
    }

    void main () {
        float L = sampleVelocity(vL).x;
        float R = sampleVelocity(vR).x;
        float T = sampleVelocity(vT).y;
        float B = sampleVelocity(vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
    }
`
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = vec2(abs(T) - abs(B), 0.0);
        force *= 1.0 / length(force + 0.00001) * curl * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
`
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    vec2 boundary (in vec2 uv) {
        uv = min(max(uv, 0.0), 1.0);
        return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    vec2 boundary (in vec2 uv) {
        uv = min(max(uv, 0.0), 1.0);
        return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`
    );

    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(
      baseVertexShader,
      ext.supportLinearFiltering
        ? advectionShader
        : advectionManualFilteringShader
    );
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader
    );

    // Initialize framebuffers
    initFramebuffers();

    // Setup the blit function and other utilities
    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (destination) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let lastTime = Date.now();

    setupEventListeners();
    multipleSplats(parseInt(Math.random() * 10) + 3); // Reduced initial splats
    update();
  } catch (error) {
    console.error("Error initializing fluid simulation:", error);
    showFallbackMessage();
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
  background: #000; /* Fallback background */
}

canvas {
  width: 100%;
  height: 100vh;
  display: block;
  touch-action: none; /* Prevent default touch behaviors */
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
