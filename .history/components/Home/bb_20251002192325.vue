<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold">UiTour Demo</h1>

    <button id="btn1" class="btn" @click="startTour">Start Tour</button>

    <div id="box1" class="demo-box">Box 1 (Top)</div>
    <div id="box2" class="demo-box">Box 2 (Right)</div>
    <div id="box3" class="demo-box">Box 3 (Bottom)</div>
    <div id="box4" class="demo-box">Box 4 (Left)</div>

    <!-- Tour Component -->
    <ElementsTour ref="tour" v-model="tourActive" :steps="steps" />
  </div>
</template>

<script setup>

const tour = ref(null)
const tourActive = ref(false)

const steps = [
  { selector: '#btn1', title: 'Start Button', content: 'Click this button to begin the tour.' },
  { selector: '#box1', title: 'Box 1', content: 'This box is near the top.' },
  { selector: '#box2', title: 'Box 2', content: 'This box is on the right.' },
  { selector: '#box3', title: 'Box 3', content: 'This box is at the bottom.' },
  { selector: '#box4', title: 'Box 4', content: 'This box is on the left.' },
]

function startTour() {
  tourActive.value = true
  setTimeout(() => tour.value.start(0), 50)
}
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  background: #4cafef;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover { background: #2196f3; }

.demo-box {
  width: 200px;
  height: 80px;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  margin: 50px auto;
}
</style>
