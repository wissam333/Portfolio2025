<template>
  <div class="p-4">
    <button id="btnStart" class="btn btn-primary" @click="openTour">Start Tour</button>

    <div id="feature1" class="mt-4 p-3 border rounded">Feature 1: some content here</div>
    <div id="feature2" class="mt-4 p-3 border rounded">Feature 2: some content here</div>

    <!-- attach tour component and control via ref -->
    <ElementsTour ref="tour" :steps="tourSteps" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UiTour from '~/components/UiTour.vue'

const tour = ref(null)

const tourSteps = [
  { selector: '#btnStart', title: 'Start button', content: 'Click this to begin the demo.', placement: 'bottom' },
  { selector: '#feature1', title: 'First feature', content: 'Details about feature one. You can use <strong>HTML</strong> here.' },
  { selector: '#feature2', title: 'Second feature', content: 'Details about feature two.' }
]

function openTour() {
  tour.value?.start(0)
}
</script>

<style>
/* optional page-specific styling */
</style>
