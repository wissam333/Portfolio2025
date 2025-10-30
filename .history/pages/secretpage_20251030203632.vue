<template>
  <div class=".body" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
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

function initFluidSimulation() {
  if (!canvas.value) return;
  // Check performance capabilities
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isHighPerf = !isMobile; // Assume desktop is higher perf

  const canvasEl = canvas.value;
  // ✅ WebGL context with fallback
  let ctx =
    canvasEl.getContext("webgl2", contextAttributes) ||
    canvasEl.getContext("webgl", contextAttributes) ||
    canvasEl.getContext("experimental-webgl", contextAttributes);

  if (!ctx) {
    alert("Your device does not support WebGL");
    return;
  }

  const gl = ctx;

  canvasEl.width = canvasEl.clientWidth;
  canvasEl.height = canvasEl.clientHeight;

  let config = {
    TEXTURE_DOWNSAMPLE: isMobile ? 2 : 1,
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE_DISSIPATION: 0.8,
    PRESSURE_ITERATIONS: isMobile ? 15 : 25,
    CURL: isMobile ? 20 : 30,
    SPLAT_RADIUS: 0.005,
  };

  let pointers = [];
  let splatStack = [];

  const { gl, ext } = getWebGLContext(canvasEl);

  function getWebGLContext(canvas) {
    const contextAttributes = {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "default",
      failIfMajorPerformanceCaveat: false, // Important for new phones!
    };

    let gl = null;
    let isWebGL2 = false;

    // Try different context types with error handling
    const contextTypes = ["webgl2", "webgl", "experimental-webgl"];

    for (const contextType of contextTypes) {
      try {
        gl = canvas.getContext(contextType, contextAttributes);
        if (gl) {
          isWebGL2 = contextType === "webgl2";
          console.log(`Using ${contextType} context`);
          break;
        }
      } catch (e) {
        console.warn(`${contextType} failed:`, e);
        continue;
      }
    }

    if (!gl) {
      console.error("All WebGL context types failed");
      return { gl: null, ext: null };
    }

    // Test if context is actually usable
    try {
      gl.getParameter(gl.VERSION);
    } catch (e) {
      console.error("WebGL context created but not usable:", e);
      return { gl: null, ext: null };
    }

    let halfFloat = null;
    let supportLinearFiltering = false;

    try {
      if (isWebGL2) {
        // For WebGL2 - try different extensions
        const extensionsToTry = [
          "EXT_color_buffer_float",
          "EXT_color_buffer_half_float",
          "OES_texture_float_linear",
          "OES_texture_half_float_linear",
        ];

        for (const extName of extensionsToTry) {
          try {
            const extension = gl.getExtension(extName);
            if (extension) {
              console.log(`Supported: ${extName}`);
            }
          } catch (e) {
            console.warn(`Extension ${extName} failed:`, e);
          }
        }

        // Get critical extensions
        halfFloat = { HALF_FLOAT: gl.HALF_FLOAT };
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      } else {
        // For WebGL1
        halfFloat = gl.getExtension("OES_texture_half_float");
        if (!halfFloat) {
          console.warn(
            "OES_texture_half_float not supported, trying fallbacks"
          );
          // Try to use FLOAT instead
          halfFloat = { HALF_FLOAT_OES: gl.FLOAT };
        } else {
          supportLinearFiltering = !!gl.getExtension(
            "OES_texture_half_float_linear"
          );
        }
      }
    } catch (e) {
      console.error("Error getting WebGL extensions:", e);
      return { gl: null, ext: null };
    }

    if (!halfFloat) {
      console.error("No half-float support available");
      return { gl: null, ext: null };
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2
      ? gl.HALF_FLOAT
      : halfFloat.HALF_FLOAT_OES || gl.FLOAT;

    // Use more conservative format detection
    let formatRGBA, formatRG, formatR;

    try {
      if (isWebGL2) {
        formatRGBA =
          getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType) ||
          getSupportedFormat(gl, gl.RGBA32F, gl.RGBA, gl.FLOAT) ||
          getSupportedFormat(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);

        formatRG =
          getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType) ||
          getSupportedFormat(gl, gl.RG32F, gl.RG, gl.FLOAT) ||
          getSupportedFormat(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);

        formatR =
          getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType) ||
          getSupportedFormat(gl, gl.R32F, gl.RED, gl.FLOAT) ||
          getSupportedFormat(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
      } else {
        // Fallback to basic formats for WebGL1
        formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
      }
    } catch (e) {
      console.error("Error detecting formats:", e);
      // Use most basic fallback
      formatRGBA =
        formatRG =
        formatR =
          { internalFormat: gl.RGBA, format: gl.RGBA };
    }

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering: !!supportLinearFiltering,
      },
    };
  }

  function getSupportedFormat(gl, internalFormat, format, type) {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }

    return {
      internalFormat,
      format,
    };
  }

  function supportRenderTextureFormat(gl, internalFormat, format, type) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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

    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) return false;
    return true;
  }

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

  let textureWidth;
  let textureHeight;
  let density;
  let velocity;
  let divergence;
  let curl;
  let pressure;
  initFramebuffers();

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
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      format,
      type,
      null
    );

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
  multipleSplats(parseInt(Math.random() * 20) + 5);
  update();

  function update() {
    resizeCanvas();

    const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
    lastTime = Date.now();

    gl.viewport(0, 0, textureWidth, textureHeight);

    if (splatStack.length > 0) multipleSplats(splatStack.pop());

    advectionProgram.bind();
    gl.uniform2f(
      advectionProgram.uniforms.texelSize,
      1.0 / textureWidth,
      1.0 / textureHeight
    );
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read[2]);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(
      advectionProgram.uniforms.dissipation,
      config.VELOCITY_DISSIPATION
    );
    blit(velocity.write[1]);
    velocity.swap();

    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
    gl.uniform1i(advectionProgram.uniforms.uSource, density.read[2]);
    gl.uniform1f(
      advectionProgram.uniforms.dissipation,
      config.DENSITY_DISSIPATION
    );
    blit(density.write[1]);
    density.swap();

    for (let i = 0; i < pointers.length; i++) {
      const pointer = pointers[i];
      if (pointer.moved) {
        splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
        pointer.moved = false;
      }
    }

    curlProgram.bind();
    gl.uniform2f(
      curlProgram.uniforms.texelSize,
      1.0 / textureWidth,
      1.0 / textureHeight
    );
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read[2]);
    blit(curl[1]);

    vorticityProgram.bind();
    gl.uniform2f(
      vorticityProgram.uniforms.texelSize,
      1.0 / textureWidth,
      1.0 / textureHeight
    );
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read[2]);
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write[1]);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(
      divergenceProgram.uniforms.texelSize,
      1.0 / textureWidth,
      1.0 / textureHeight
    );
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read[2]);
    blit(divergence[1]);

    clearProgram.bind();
    let pressureTexId = pressure.read[2];
    gl.activeTexture(gl.TEXTURE0 + pressureTexId);
    gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
    gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
    blit(pressure.write[1]);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(
      pressureProgram.uniforms.texelSize,
      1.0 / textureWidth,
      1.0 / textureHeight
    );
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
    pressureTexId = pressure.read[2];
    gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
    gl.activeTexture(gl.TEXTURE0 + pressureTexId);
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
      blit(pressure.write[1]);
      pressure.swap();
    }

    gradienSubtractProgram.bind();
    gl.uniform2f(
      gradienSubtractProgram.uniforms.texelSize,
      1.0 / textureWidth,
      1.0 / textureHeight
    );
    gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read[2]);
    gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read[2]);
    blit(velocity.write[1]);
    velocity.swap();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    displayProgram.bind();
    gl.uniform1i(displayProgram.uniforms.uTexture, density.read[2]);
    blit(null);

    requestAnimationFrame(update);
  }

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
    gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
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

  function multipleSplats(amount) {
    for (let i = 0; i < amount; i++) {
      const color = [
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
      ];
      const x = canvasEl.width * Math.random();
      const y = canvasEl.height * Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      splat(x, y, dx, dy, color);
    }
  }

  function resizeCanvas() {
    if (
      canvasEl.width != canvasEl.clientWidth ||
      canvasEl.height != canvasEl.clientHeight
    ) {
      canvasEl.width = canvasEl.clientWidth;
      canvasEl.height = canvasEl.clientHeight;
      initFramebuffers();
    }
  }

  // Event listeners
  canvasEl.addEventListener("mousemove", (e) => {
    pointers[0].moved = pointers[0].down;
    pointers[0].dx = (e.offsetX - pointers[0].x) * 10.0;
    pointers[0].dy = (e.offsetY - pointers[0].y) * 10.0;
    pointers[0].x = e.offsetX;
    pointers[0].y = e.offsetY;
  });

  canvasEl.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        let pointer = pointers[i];
        pointer.moved = pointer.down;
        pointer.dx = (touches[i].pageX - pointer.x) * 10.0;
        pointer.dy = (touches[i].pageY - pointer.y) * 10.0;
        pointer.x = touches[i].pageX;
        pointer.y = touches[i].pageY;
      }
    },
    false
  );

  canvasEl.addEventListener("mousedown", () => {
    pointers[0].down = true;
    pointers[0].color = [
      Math.random() + 0.2,
      Math.random() + 0.2,
      Math.random() + 0.2,
    ];
  });

  canvasEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
      if (i >= pointers.length) pointers.push(new pointerPrototype());

      pointers[i].id = touches[i].identifier;
      pointers[i].down = true;
      pointers[i].x = touches[i].pageX;
      pointers[i].y = touches[i].pageY;
      pointers[i].color = [
        Math.random() + 0.2,
        Math.random() + 0.2,
        Math.random() + 0.2,
      ];
    }
  });

  window.addEventListener("mouseup", () => {
    pointers[0].down = false;
  });

  window.addEventListener("touchend", (e) => {
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++)
      for (let j = 0; j < pointers.length; j++)
        if (touches[i].identifier == pointers[j].id) pointers[j].down = false;
  });
}
</script>

<style scoped>
.body {
  margin: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100vh;
  display: block;
}

h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 40px;
  user-select: none;
  text-wrap: nowrap;
  text-align: center;
  pointer-events: none;
  z-index: 10;
}

@media (min-width: 768px) {
  h1 {
    font-size: 60px;
  }
}
</style>
