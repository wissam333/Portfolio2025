<template>
  <div class="tour-demo">
    <h1>UI Tour Demo</h1>

    <div class="demo-section" id="step1">Step 1: Header Section</div>
    <div class="demo-section" id="step2">Step 2: Feature Section</div>
    <div class="demo-section" id="step3">Step 3: Footer Section</div>

    <button class="start-tour" @click="startTour">Start Tour</button>

    <!-- Tour component -->
    <ElementsTour
      ref="tour"
      v-model="tourActive"
      :steps="steps"
      @step="onStep"
      @end="onEnd"
    />
  </div>
</template>

<script setup>

const tour = ref(null)
const tourActive = ref(false)

const steps = [
  { selector: '#step1', title: 'Header', content: 'This is the header section.' },
  { selector: '#step2', title: 'Feature', content: 'Here is the feature section.' },
  { selector: '#step3', title: 'Footer', content: 'Finally, the footer section.' }
]

function startTour() {
  tourActive.value = true
  nextTick(() => tour.value.start(0))
}

function onStep(index) {
  console.log('Current step:', index)
}

function onEnd() {
  console.log('Tour ended')
}
</script>

<style scoped>
.tour-demo {
  padding: 40px;
}

.demo-section {
  height: 400px;
  margin: 40px 0;
  background: #e0f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.start-tour {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background: #4cafef;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}
.start-tour:hover {
  background: #2196f3;
}
</style>
