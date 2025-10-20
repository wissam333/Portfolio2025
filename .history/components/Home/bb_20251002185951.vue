<template>
  <div class="p-6">
    <Button id="btnStart" label="Start" severity="primary" />

    <div id="feature1" class="mt-5 p-3 border">Feature One</div>
    <div id="feature2" class="mt-5 p-3 border">Feature Two</div>

    <UiTour :steps="tourSteps" :start="true" />
  </div>
</template>

<script setup>
const tourSteps = [
  { selector: '#btnStart', title: 'Welcome', content: 'Click here to begin.' },
  { selector: '#feature1', title: 'Feature 1', content: 'This is the first feature.' },
  { selector: '#feature2', title: 'Feature 2', content: 'And here is the second one.' }
]
</script>
