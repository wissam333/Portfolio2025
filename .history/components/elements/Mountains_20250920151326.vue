<template>
  <div class="mountains-wrapper">
    <!-- Mountains SVG -->
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      class="mountains-svg"
    >
      <path
        fill="#4a5568"
        d="M0,256L48,234.7C96,213,192,171,288,144C384,117,480,107,576,101.3C672,96,768,96,864,117.3C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
  </div>
</template>

<script setup></script>

<style scoped>
.mountains-wrapper {
  width: 100%;
  height: 30vh;
  overflow: hidden;
}

.mountains-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
